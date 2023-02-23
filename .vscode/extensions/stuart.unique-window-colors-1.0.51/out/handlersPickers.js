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
const tools_1 = require("./tools");
const animation_1 = require("./animation");
exports.parseHex = (selection) => '#' + selection.split('#')[1].split(' ')[0];
/**
 *
 * @param s internalSettings object
 */
function getAdjustedForegroundBaseColor(s) {
    return s[Constants_1.C.UseCustomForegroundColor] ?
        colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]) :
        Color('red');
}
class Pickers {
    static backgroundColorPickerHueHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            const s = tools_1.Tools.getInternalSettingsObject();
            let c = tools_1.Tools.getExtensionSettings();
            const adjustedForegroundBaseColor = getAdjustedForegroundBaseColor(s);
            const options = {
                placeHolder: 'Select a color',
                onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                    if (s[Constants_1.C.animationDoAnimate]) {
                        animation_1.A.doAnimate = false;
                    }
                    const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(exports.parseHex(selection), s[Constants_1.C.BackgroundSaturation], s[Constants_1.C.BackgroundLightness]);
                    yield tools_1.Tools.setSomeColors(c, s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
                })
            };
            // if (s[C.animationDoAnimate]) {
            //   A.doAnimate = false;
            // }
            let selection = yield vscode.window.showQuickPick(colorPickerArrays_1.DropdownArrays.color, options);
            if (selection === undefined) {
                // const adjustedBackgroundBaseColor = ColorManip.adjustColor(s[C.BaseColor], s[C.BackgroundSaturation], s[C.BackgroundLightness]);
                // await Tools.setSomeColors(c, s[C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
                const cc = tools_1.Tools.buildCcFromInternalSettings(s);
                yield tools_1.Tools.setColorCustomizations(cc);
                if (s[Constants_1.C.animationDoAnimate] && animation_1.A.doAnimate === false) {
                    yield animation_1.animate(s[Constants_1.C.animationGradientInputStr]); //Tools.setInternalSetting(C.animationDoAnimate, false);
                }
            }
            else {
                yield tools_1.Tools.setInternalSettings({
                    [Constants_1.C.BaseColor]: exports.parseHex(selection),
                    [Constants_1.C.portfolioAndColor]: undefined,
                    [Constants_1.C.useAutomatic]: undefined,
                    [Constants_1.C.animationDoAnimate]: false
                });
            }
        });
    }
    static backgroundColorPickerSaturationHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tools_1.Tools.getInternalSetting(Constants_1.C.BaseColor)) {
                tools_1.Tools.showInformationMessage('Select a background color first via "Select background color"');
                return;
            }
            let c = tools_1.Tools.getExtensionSettings();
            let s = tools_1.Tools.getInternalSettingsObject();
            const adjustedForegroundBaseColor = getAdjustedForegroundBaseColor(s);
            const options = {
                placeHolder: 'Select a saturation',
                onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                    const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.BaseColor], parseFloat(selection), s[Constants_1.C.BackgroundLightness]);
                    yield tools_1.Tools.setSomeColors(c, s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
                })
            };
            let selection = yield vscode.window.showQuickPick(colorPickerArrays_1.DropdownArrays.saturation, options);
            if (selection === undefined) {
                const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.BaseColor], s[Constants_1.C.BackgroundSaturation], s[Constants_1.C.BackgroundLightness]);
                yield tools_1.Tools.setSomeColors(c, s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
            }
            else {
                yield tools_1.Tools.setInternalSetting(Constants_1.C.BackgroundSaturation, parseFloat(selection));
            }
        });
    }
    static backgroundColorPickerLightnessHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tools_1.Tools.getInternalSetting(Constants_1.C.BaseColor)) {
                tools_1.Tools.showInformationMessage('Select a background color first via "Select background color"');
                return;
            }
            let s = tools_1.Tools.getInternalSettingsObject();
            let c = tools_1.Tools.getExtensionSettings();
            const adjustedForegroundBaseColor = getAdjustedForegroundBaseColor(s);
            const options = {
                placeHolder: 'Select a lightness',
                onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                    const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.BaseColor], s[Constants_1.C.BackgroundSaturation], parseFloat(selection));
                    yield tools_1.Tools.setSomeColors(c, s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
                })
            };
            let selection = yield vscode.window.showQuickPick(colorPickerArrays_1.DropdownArrays.lightness, options);
            if (selection === undefined) {
                const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.BaseColor], s[Constants_1.C.BackgroundSaturation], s[Constants_1.C.BackgroundLightness]);
                yield tools_1.Tools.setSomeColors(c, s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
            }
            else {
                yield tools_1.Tools.setInternalSettings({
                    [Constants_1.C.BackgroundLightness]: parseFloat(selection),
                    [Constants_1.C.portfolioAndColor]: undefined,
                    [Constants_1.C.useAutomatic]: undefined
                });
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///// Foreground /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static foregroundColorPickerHueHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            let s = tools_1.Tools.getInternalSettingsObject();
            let c = tools_1.Tools.getExtensionSettings();
            let cc = tools_1.Tools.getColorCustomizations();
            const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.BaseColor], s[Constants_1.C.BackgroundSaturation], s[Constants_1.C.BackgroundLightness]);
            const options = {
                placeHolder: 'Select a foreground color',
                onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                    if (selection === Constants_1.C.auto) {
                        yield tools_1.Tools.setSomeColors(c, false, adjustedBackgroundBaseColor, Color('red'));
                    }
                    else {
                        const adjustedForegroundBaseColor = colorManip_1.ColorManip.adjustColor(exports.parseHex(selection), s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]);
                        yield tools_1.Tools.setForegroundColors(cc, c, adjustedForegroundBaseColor);
                    }
                })
            };
            let selection = yield vscode.window.showQuickPick([Constants_1.C.auto, ...colorPickerArrays_1.DropdownArrays.color], options);
            if (selection === undefined) {
                const adjustedForegroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]);
                yield tools_1.Tools.setSomeColors(c, s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
            }
            else if (selection === Constants_1.C.auto) {
                yield tools_1.Tools.setInternalSetting(Constants_1.C.UseCustomForegroundColor, false);
            }
            else {
                yield tools_1.Tools.setInternalSettings({
                    [Constants_1.C.UseCustomForegroundColor]: true,
                    [Constants_1.C.ForegroundBaseColor]: exports.parseHex(selection),
                    [Constants_1.C.portfolioAndColor]: undefined,
                    [Constants_1.C.useAutomatic]: undefined
                });
            }
        });
    }
    static foregroundColorPickerSaturationHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!handleMissingForegroundColor()) {
                return;
            }
            let cc = tools_1.Tools.getColorCustomizations();
            let s = tools_1.Tools.getInternalSettingsObject();
            let c = tools_1.Tools.getExtensionSettings();
            const options = {
                placeHolder: 'Select a foreground saturation',
                onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                    const adjustedForegroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], parseFloat(selection), s[Constants_1.C.ForegroundLightness]);
                    yield tools_1.Tools.setForegroundColors(cc, c, adjustedForegroundBaseColor);
                })
            };
            let selection = yield vscode.window.showQuickPick(colorPickerArrays_1.DropdownArrays.saturation, options);
            if (selection === undefined) {
                const adjustedForegroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]);
                yield tools_1.Tools.setForegroundColors(cc, c, adjustedForegroundBaseColor);
            }
            else {
                yield tools_1.Tools.setInternalSettings({
                    [Constants_1.C.ForegroundSaturation]: parseFloat(selection),
                    [Constants_1.C.portfolioAndColor]: undefined,
                    [Constants_1.C.useAutomatic]: undefined
                });
            }
        });
    }
    static foregroundColorPickerLightnessHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!handleMissingForegroundColor()) {
                return;
            }
            let cc = tools_1.Tools.getColorCustomizations();
            let s = tools_1.Tools.getInternalSettingsObject();
            let c = tools_1.Tools.getExtensionSettings();
            const options = {
                placeHolder: 'Select a lightness',
                onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                    const adjustedForegroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], parseFloat(selection));
                    yield tools_1.Tools.setForegroundColors(cc, c, adjustedForegroundBaseColor);
                })
            };
            let selection = yield vscode.window.showQuickPick(colorPickerArrays_1.DropdownArrays.lightness, options);
            if (selection === undefined) {
                const adjustedForegroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]);
                yield tools_1.Tools.setForegroundColors(cc, c, adjustedForegroundBaseColor);
            }
            else {
                yield tools_1.Tools.setInternalSettings({
                    [Constants_1.C.ForegroundLightness]: parseFloat(selection),
                    [Constants_1.C.portfolioAndColor]: undefined,
                    [Constants_1.C.useAutomatic]: undefined
                });
            }
        });
    }
}
exports.Pickers = Pickers;
function handleMissingForegroundColor() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tools_1.Tools.getInternalSetting(Constants_1.C.ForegroundBaseColor)) {
            const activityBar_foreground = tools_1.Tools.getColorCustomizations()[Constants_1.C.activityBar_foreground];
            if (activityBar_foreground) {
                yield tools_1.Tools.setInternalSetting(Constants_1.C.ForegroundBaseColor, activityBar_foreground);
                return true;
            }
            else {
                tools_1.Tools.showInformationMessage('Select a foreground color first via "Select foreground color"');
                return false;
            }
        }
        return true;
    });
}
//# sourceMappingURL=handlersPickers.js.map