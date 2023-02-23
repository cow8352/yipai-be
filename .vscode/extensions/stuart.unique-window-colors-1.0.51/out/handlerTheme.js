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
function themePickerHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        let initTheme = tools_1.Tools.getTheme();
        const currentSetting = Constants_1.C.CURR_SET + initTheme;
        const options = {
            placeHolder: 'Select a theme',
            onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                selection = selection.replace(Constants_1.C.CURR_SET, '');
                yield tools_1.Tools.setTheme(selection);
            })
        };
        let selection = yield vscode.window.showQuickPick([currentSetting, ...colorPickerArrays_1.DropdownArrays.themes], options);
        selection = selection.replace(Constants_1.C.CURR_SET, '');
        console.log('before setting theme to ' + selection);
        // await sleep(1000);
        // await Tools.setTheme(selection);
        yield tools_1.Tools.setInternalSetting(Constants_1.C.theme, selection);
        console.log('after setting theme to ' + selection);
        // vscode.workbench.action.reloadWindow();
        //otherwise it crashes quietly sometimes, like alternating between resetting and changing theme (stuff that interacts w/ the disk)
        yield vscode.window.showInformationMessage('Please reload the window now:  ⌘+R (Mac) or Ctrl+R (Win)');
        // Tools.showInformationMessage('Please reload the window now: Cmd+R(Mac) or Ctrl+R(Win)');
    });
}
exports.themePickerHandler = themePickerHandler;
//# sourceMappingURL=handlerTheme.js.map