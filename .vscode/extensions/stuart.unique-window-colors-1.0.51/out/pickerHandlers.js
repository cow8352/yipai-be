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
const colorPickerArrays_1 = require("./colorPickerArrays");
const Constants_1 = require("./Constants");
const rootHashColorer_1 = require("./rootHashColorer");
const tools_1 = require("./tools");
const getHexFromHueDropdown = (selection) => '#' + selection.split('#')[1].split(' ')[0];
const CURR_SET = 'Current setting: ';
class Pickers {
    static backgroundColorPickerHueHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            let s = tools_1.Tools.getSettings();
            const currentSetting = CURR_SET + tools_1.Tools.getSetting(Constants_1.C.BaseColor);
            const adjustedForegroundBaseColor = s[Constants_1.C.UseCustomForegroundColor] ?
                colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]) :
                Color('red');
            const options = {
                placeHolder: 'Select a color',
                onDidSelectItem: (item) => __awaiter(this, void 0, void 0, function* () {
                    if (s[Constants_1.C.ModifyTitleBar] || s[Constants_1.C.ModifyActivityBar] || s[Constants_1.C.ModifyStatusBar]) {
                        item = item.replace(CURR_SET, '');
                        if (item === Constants_1.C.auto) {
                            item = rootHashColorer_1.getAutomaticColor().hex();
                        }
                        const hexBaseColor = getHexFromHueDropdown(item);
                        const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(hexBaseColor, s[Constants_1.C.BackgroundSaturation], s[Constants_1.C.BackgroundLightness]);
                        yield tools_1.Tools.setSomeColors(s[Constants_1.C.ModifyTitleBar], s[Constants_1.C.ModifyActivityBar], s[Constants_1.C.ModifyStatusBar], s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
                    }
                })
            };
            let selection = yield vscode.window.showQuickPick([currentSetting, Constants_1.C.auto, ...colorPickerArrays_1.DropdownArrays.color], options);
            if (selection === Constants_1.C.auto) {
                yield tools_1.Tools.setSetting(Constants_1.C.BaseColor, rootHashColorer_1.getAutomaticColor().hex());
            }
            else {
                yield tools_1.Tools.setSetting(Constants_1.C.BaseColor, getHexFromHueDropdown(selection));
            }
        });
    }
    static backgroundColorPickerSaturationHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tools_1.Tools.getSetting(Constants_1.C.BaseColor)) {
                tools_1.Tools.showInformationMessage('Select a background color first via "Select background color"');
                return;
            }
            let s = tools_1.Tools.getSettings();
            const currentSetting = CURR_SET + tools_1.Tools.getSetting(Constants_1.C.BackgroundSaturation);
            const adjustedForegroundBaseColor = s[Constants_1.C.UseCustomForegroundColor] ?
                colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]) :
                Color('red');
            const options = {
                placeHolder: 'Select a saturation',
                onDidSelectItem: (item) => __awaiter(this, void 0, void 0, function* () {
                    item = item.replace(CURR_SET, '');
                    if (s[Constants_1.C.ModifyTitleBar] || s[Constants_1.C.ModifyActivityBar] || s[Constants_1.C.ModifyStatusBar]) {
                        const backgroundSaturation = parseFloat(item);
                        const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.BaseColor], backgroundSaturation, s[Constants_1.C.BackgroundLightness]);
                        yield tools_1.Tools.setSomeColors(s[Constants_1.C.ModifyTitleBar], s[Constants_1.C.ModifyActivityBar], s[Constants_1.C.ModifyStatusBar], s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
                    }
                })
            };
            let selection = yield vscode.window.showQuickPick([currentSetting, ...colorPickerArrays_1.DropdownArrays.saturation], options);
            yield tools_1.Tools.setSetting(Constants_1.C.BackgroundSaturation, parseFloat(selection));
        });
    }
    static backgroundColorPickerLightnessHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tools_1.Tools.getSetting(Constants_1.C.BaseColor)) {
                tools_1.Tools.showInformationMessage('Select a background color first via "Select background color"');
                return;
            }
            let s = tools_1.Tools.getSettings();
            const currentSetting = CURR_SET + tools_1.Tools.getSetting(Constants_1.C.BackgroundLightness);
            const adjustedForegroundBaseColor = s[Constants_1.C.UseCustomForegroundColor] ?
                colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]) :
                Color('red');
            const options = {
                placeHolder: 'Select a lightness',
                onDidSelectItem: (item) => __awaiter(this, void 0, void 0, function* () {
                    item = item.replace(CURR_SET, '');
                    if (s[Constants_1.C.ModifyTitleBar] || s[Constants_1.C.ModifyActivityBar] || s[Constants_1.C.ModifyStatusBar]) {
                        const backgroundLightness = parseFloat(item);
                        const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.BaseColor], s[Constants_1.C.BackgroundSaturation], backgroundLightness);
                        yield tools_1.Tools.setSomeColors(s[Constants_1.C.ModifyTitleBar], s[Constants_1.C.ModifyActivityBar], s[Constants_1.C.ModifyStatusBar], s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
                    }
                })
            };
            let selection = yield vscode.window.showQuickPick([currentSetting, ...colorPickerArrays_1.DropdownArrays.lightness], options);
            const lightness = parseFloat(selection);
            yield tools_1.Tools.setSetting(Constants_1.C.BackgroundLightness, lightness);
        });
    }
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    //asdf
    static foregroundColorPickerHueHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            let s = tools_1.Tools.getSettings();
            let cc = tools_1.Tools.getColorCustomizations();
            const currentSetting = CURR_SET + (s[Constants_1.C.UseCustomForegroundColor] ? tools_1.Tools.getSetting(Constants_1.C.ForegroundBaseColor) : Constants_1.C.auto);
            const options = {
                placeHolder: 'Select a foreground color',
                onDidSelectItem: (item) => __awaiter(this, void 0, void 0, function* () {
                    if (s[Constants_1.C.ModifyTitleBar] || s[Constants_1.C.ModifyActivityBar] || s[Constants_1.C.ModifyStatusBar]) {
                        item = item.replace(CURR_SET, '');
                        if (item === Constants_1.C.auto) {
                            tools_1.Tools.showInformationMessage('automatic!');
                            const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.BaseColor], s[Constants_1.C.BackgroundSaturation], s[Constants_1.C.BackgroundLightness]);
                            yield tools_1.Tools.setSomeColors(s[Constants_1.C.ModifyTitleBar], s[Constants_1.C.ModifyActivityBar], s[Constants_1.C.ModifyStatusBar], false, adjustedBackgroundBaseColor, Color('red'));
                        }
                        else {
                            const hexBaseColor = getHexFromHueDropdown(item);
                            const adjustedForegroundBaseColor = colorManip_1.ColorManip.adjustColor(hexBaseColor, s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]);
                            yield tools_1.Tools.setForegroundColors(cc, s[Constants_1.C.ModifyTitleBar], s[Constants_1.C.ModifyActivityBar], s[Constants_1.C.ModifyStatusBar], adjustedForegroundBaseColor);
                        }
                    }
                })
            };
            let selection = yield vscode.window.showQuickPick([currentSetting, Constants_1.C.auto, ...colorPickerArrays_1.DropdownArrays.color], options);
            if (selection === Constants_1.C.auto) {
                yield tools_1.Tools.setSetting(Constants_1.C.UseCustomForegroundColor, false);
            }
            else {
                yield tools_1.Tools.setSetting(Constants_1.C.UseCustomForegroundColor, true);
                yield tools_1.Tools.setSetting(Constants_1.C.ForegroundBaseColor, getHexFromHueDropdown(selection));
            }
        });
    }
    static foregroundColorPickerSaturationHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tools_1.Tools.getSetting(Constants_1.C.ForegroundBaseColor)) {
                tools_1.Tools.showInformationMessage('Select a foreground color first via "Select foreground color"');
                return;
            }
            let cc = tools_1.Tools.getColorCustomizations();
            let s = tools_1.Tools.getSettings();
            const currentSetting = CURR_SET + tools_1.Tools.getSetting(Constants_1.C.ForegroundSaturation);
            const options = {
                placeHolder: 'Select a foreground saturation',
                onDidSelectItem: (item) => __awaiter(this, void 0, void 0, function* () {
                    item = item.replace(CURR_SET, '');
                    if (s[Constants_1.C.ModifyTitleBar] || s[Constants_1.C.ModifyActivityBar] || s[Constants_1.C.ModifyStatusBar]) {
                        const foreroundSaturation = parseFloat(item);
                        const adjustedForegroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], foreroundSaturation, s[Constants_1.C.ForegroundLightness]);
                        yield tools_1.Tools.setForegroundColors(cc, s[Constants_1.C.ModifyTitleBar], s[Constants_1.C.ModifyActivityBar], s[Constants_1.C.ModifyStatusBar], adjustedForegroundBaseColor);
                    }
                })
            };
            let selection = yield vscode.window.showQuickPick([currentSetting, ...colorPickerArrays_1.DropdownArrays.saturation], options);
            yield tools_1.Tools.setSetting(Constants_1.C.ForegroundSaturation, parseFloat(selection));
        });
    }
    static foregroundColorPickerLightnessHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tools_1.Tools.getSetting(Constants_1.C.BaseColor)) {
                tools_1.Tools.showInformationMessage('Select a foreground color first via "Select foreground color"');
                return;
            }
            let cc = tools_1.Tools.getColorCustomizations();
            let s = tools_1.Tools.getSettings();
            const currentSetting = CURR_SET + tools_1.Tools.getSetting(Constants_1.C.ForegroundLightness);
            const options = {
                placeHolder: 'Select a lightness',
                onDidSelectItem: (item) => __awaiter(this, void 0, void 0, function* () {
                    item = item.replace(CURR_SET, '');
                    if (s[Constants_1.C.ModifyTitleBar] || s[Constants_1.C.ModifyActivityBar] || s[Constants_1.C.ModifyStatusBar]) {
                        const foregroundLightness = parseFloat(item);
                        const adjustedForegroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], foregroundLightness);
                        yield tools_1.Tools.setForegroundColors(cc, s[Constants_1.C.ModifyTitleBar], s[Constants_1.C.ModifyActivityBar], s[Constants_1.C.ModifyStatusBar], adjustedForegroundBaseColor);
                    }
                })
            };
            let selection = yield vscode.window.showQuickPick([currentSetting, ...colorPickerArrays_1.DropdownArrays.lightness], options);
            const lightness = parseFloat(selection);
            yield tools_1.Tools.setSetting(Constants_1.C.ForegroundLightness, lightness);
        });
    }
}
exports.Pickers = Pickers;
//# sourceMappingURL=pickerHandlers.js.map