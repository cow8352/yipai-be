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
const Color = require("color");
const vscode = require("vscode");
const colorManip_1 = require("./colorManip");
const Constants_1 = require("./Constants");
const tools_1 = require("./tools");
function showModifyBarDropdown(barName) {
    return __awaiter(this, void 0, void 0, function* () {
        let s = tools_1.Tools.getSettings();
        const adjustedForegroundBaseColor = s[Constants_1.C.UseCustomForegroundColor] ?
            colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]) :
            Color('red');
        const settingName = getSettingNameFromBarName(barName);
        const dropdownValues = [`Current value (${s[settingName] ? 'yes' : 'no'})`, 'yes', 'no'];
        const options = {
            placeHolder: 'Modify the ' + barName + ' bar color?',
            onDidSelectItem: (item) => __awaiter(this, void 0, void 0, function* () {
                s[settingName] = item.includes('yes');
                const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.BaseColor], s[Constants_1.C.BackgroundSaturation], s[Constants_1.C.BackgroundLightness]);
                yield tools_1.Tools.setSomeColors(s[Constants_1.C.ModifyTitleBar], s[Constants_1.C.ModifyActivityBar], s[Constants_1.C.ModifyStatusBar], s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
            })
        };
        return JSON.stringify(yield vscode.window.showQuickPick(dropdownValues, options));
    });
}
exports.showModifyBarDropdown = showModifyBarDropdown;
function modifyStatusBarHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        tools_1.Tools.setSetting(Constants_1.C.ModifyStatusBar, (yield showModifyBarDropdown('status')).includes('yes'));
    });
}
exports.modifyStatusBarHandler = modifyStatusBarHandler;
const getSettingNameFromBarName = (barName) => 'Modify' + barName.charAt(0).toUpperCase() + barName.slice(1) + 'Bar';
function modifyBarHandler(barName) {
    return __awaiter(this, void 0, void 0, function* () {
        const settingName = getSettingNameFromBarName(barName);
        const selection = yield showModifyBarDropdown(barName);
        const value = selection.includes('yes');
        tools_1.Tools.setSetting(settingName, value);
    });
}
exports.modifyBarHandler = modifyBarHandler;
//# sourceMappingURL=modifyBarHandling.js.map