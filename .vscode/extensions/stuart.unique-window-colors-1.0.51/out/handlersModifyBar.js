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
const tools_1 = require("./tools");
const Constants_1 = require("./Constants");
const getSettingNameFromBarName = (barName) => 'Modify' + barName.charAt(0).toUpperCase() + barName.slice(1) + 'Bar';
function modifyBarHandler(barName) {
    return __awaiter(this, void 0, void 0, function* () {
        // let s = Tools.getInternalSettingsObject();
        let c = tools_1.Tools.getExtensionSettings();
        const settingName = getSettingNameFromBarName(barName);
        const dropdownValues = [`Current value (${c[settingName] === true ? 'yes' : 'no'})`, 'yes', 'no'];
        const options = {
            placeHolder: 'Modify the ' + barName + ' bar color?',
            onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                yield tools_1.Tools.setGlobalSetting(settingName, selection.includes('yes'));
            })
        };
        const selection = yield vscode.window.showQuickPick(dropdownValues, options);
        if (selection === undefined) {
            yield tools_1.Tools.setGlobalSetting(settingName, c[settingName]);
            return;
        }
        yield tools_1.Tools.setGlobalSetting(settingName, selection.includes('yes'));
    });
}
exports.modifyBarHandler = modifyBarHandler;
function setModifiedAreasHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const c = tools_1.Tools.getExtensionSettings();
        if (!c[Constants_1.C.internalSettings] || !c[Constants_1.C.internalSettings][Constants_1.C.BaseColor]) {
            vscode.window.showWarningMessage("You don't have any colors set so changing modified areas won't have any visible effect.");
        }
        const TITLE_BAR_OPTION = Constants_1.C.TITLE_BAR + (c[Constants_1.C.ModifyTitleBar] ? '  ✅' : '');
        const ACTIVITY_BAR_OPTION = Constants_1.C.ACTIVITY_BAR + (c[Constants_1.C.ModifyActivityBar] ? '  ✅' : '');
        const STATUS_BAR_OPTION = Constants_1.C.STATUS_BAR + (c[Constants_1.C.ModifyStatusBar] ? '  ✅' : '');
        let selection = yield vscode.window.showQuickPick([TITLE_BAR_OPTION, ACTIVITY_BAR_OPTION, STATUS_BAR_OPTION], { placeHolder: 'Toggle modification for:', });
        switch (selection) {
            case TITLE_BAR_OPTION:
                yield modifyBarHandler('title');
                break;
            case ACTIVITY_BAR_OPTION:
                yield modifyBarHandler('activity');
                break;
            case STATUS_BAR_OPTION:
                yield modifyBarHandler('status');
                break;
        }
    });
}
exports.setModifiedAreasHandler = setModifiedAreasHandler;
//# sourceMappingURL=handlersModifyBar.js.map