"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const colorPickerArrays_1 = require("./colorPickerArrays");
const Constants_1 = require("./Constants");
const tools_1 = require("./tools");
const handlersEditors_1 = require("./handlersEditors");
const handlerThemeEditor_1 = require("./handlerThemeEditor");
const messages_1 = require("./messages");
function setThemeHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        let initTheme = tools_1.Tools.getTheme();
        const options = {
            placeHolder: 'Select a theme',
            onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                yield tools_1.Tools.setTheme(selection);
            })
        };
        let selection = yield vscode.window.showQuickPick(colorPickerArrays_1.DropdownArrays.themes, options);
        if (selection === undefined) {
            yield tools_1.Tools.setTheme(initTheme);
        }
        else {
            yield tools_1.Tools.setInternalSetting(Constants_1.C.theme, selection);
        }
        //otherwise it crashes quietly sometimes, like alternating between resetting and changing theme (stuff that interacts w/ the disk)
        yield vscode.window.showInformationMessage('Please reload the window now (Command Palette → "Reload Window")');
    });
}
exports.setThemeHandler = setThemeHandler;
/** TODO - replace this with: clear colors for all workspaces vs just this one. */
function resetHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const REMOVE_COLORS_FOR_THIS_WORKSPACE = "Remove colors for this workspace.";
            const REMOVE_COLORS_FOR_ALL_WORKSPACES = "Remove colors for ALL WORKSPACES.";
            const REMOVE_ALL_EXTENSION_DATA = "Remove ALL WINDOW COLORS DATA.";
            let selection = yield vscode.window.showQuickPick([REMOVE_COLORS_FOR_THIS_WORKSPACE, REMOVE_COLORS_FOR_ALL_WORKSPACES, REMOVE_ALL_EXTENSION_DATA], { placeHolder: 'Reload the window if this crashes the command palette.  ⌘+R (Mac) or Ctrl+R (Win)', });
            switch (selection) {
                case REMOVE_COLORS_FOR_THIS_WORKSPACE:
                    yield tools_1.Tools.clearWorkspaceSettings();
                    yield tools_1.Tools.clearExternalWorkspaceSettings(tools_1.Tools.getWorkspaceRoot());
                    tools_1.Tools.deleteExternalWorkspaceSettingsMaybe(tools_1.Tools.getWorkspaceRoot());
                    messages_1.Errors.pleaseReload();
                    break;
                case REMOVE_COLORS_FOR_ALL_WORKSPACES:
                    yield tools_1.Tools.clearWorkspaceSettings();
                    tools_1.Tools.clearAllWorkspacesLocalSettings();
                    yield tools_1.Tools.removeAllWorkspacesFromGlobalData();
                    yield tools_1.Tools.clearExternalWorkspaceSettings(tools_1.Tools.getWorkspaceRoot()); //ensure local .vscode/settings deleted
                    tools_1.Tools.deleteExternalWorkspaceSettingsMaybe(tools_1.Tools.getWorkspaceRoot());
                    messages_1.Errors.pleaseReload();
                    break;
                case REMOVE_ALL_EXTENSION_DATA:
                    yield tools_1.Tools.clearWorkspaceSettings();
                    tools_1.Tools.clearAllWorkspacesLocalSettings();
                    yield tools_1.Tools.deleteWorkspaceGlobalSettingsValue();
                    // Tools.deleteLocalSettingsFileIfSafeToDo();
                    yield tools_1.Tools.clearExtensionSettings();
                    yield tools_1.Tools.clearExternalWorkspaceSettings(tools_1.Tools.getWorkspaceRoot()); //ensure local .vscode/settings deleted
                    tools_1.Tools.deleteExternalWorkspaceSettingsMaybe(tools_1.Tools.getWorkspaceRoot());
                    messages_1.Errors.pleaseReload();
                    tools_1.Tools.deleteAllWorkspacesLocalSettingsMaybe();
                    break;
            }
        }
        catch (err) {
            console.log('caught an exception: resetHandler', err);
        }
    });
}
exports.resetHandler = resetHandler;
function setColorsHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const BASE_COLOR = "Base Color";
        const FONT_COLOR = "Font Color";
        const CUSTOM_COLOR = "Custom Element Color";
        const selection = yield vscode.window.showQuickPick([BASE_COLOR, FONT_COLOR, CUSTOM_COLOR], { placeHolder: 'Select the color to set:' });
        switch (selection) {
            case BASE_COLOR:
                yield handlersEditors_1.Editors.backgroundEditorHandler();
                break;
            case FONT_COLOR:
                yield handlersEditors_1.Editors.foregroundEditorHandler();
                break;
            case CUSTOM_COLOR:
                yield handlerThemeEditor_1.themeEditorHandler();
                break;
        }
    });
}
exports.setColorsHandler = setColorsHandler;
//# sourceMappingURL=handlerMisc.js.map