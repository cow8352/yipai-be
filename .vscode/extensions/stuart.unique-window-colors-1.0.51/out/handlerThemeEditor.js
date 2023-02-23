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
const handlersPickers_1 = require("./handlersPickers");
const tools_1 = require("./tools");
const messages_1 = require("./messages");
function setColorFromPrompt(themeItem) {
    return __awaiter(this, void 0, void 0, function* () {
        let inputColor = yield vscode.window.showInputBox({
            placeHolder: 'hex code or html name (eg "#abcd00" or "whitesmoke")',
            prompt: `Enter a color for ${themeItem}`
        });
        if (inputColor === undefined) {
            return;
        }
        inputColor = tools_1.Tools.trim(inputColor);
        if (!tools_1.Tools.isValidColor(inputColor)) {
            vscode.window.showErrorMessage(`"${inputColor}" is not a valid color.`);
            messages_1.Errors.invalidColor(inputColor);
            return;
        }
        const hex = Color(inputColor).hex();
        yield tools_1.Tools.setCustomThemeItem(themeItem, { [Constants_1.C.customThemeBaseColor]: hex, [Constants_1.C.customThemeSaturation]: Constants_1.C.defaultSaturation, [Constants_1.C.customThemeLightness]: Constants_1.C.defaultLightness });
    });
}
function selectColor(themeItem, basecolor, saturation, lightness, cc, ccDefault, ccInit) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            placeHolder: 'Select a color for ' + themeItem,
            onDidSelectItem: (item) => __awaiter(this, void 0, void 0, function* () {
                if (item === Constants_1.C.default) {
                    yield tools_1.Tools.setColorCustomizations(ccDefault);
                }
                else {
                    yield tools_1.Tools.setColorCustomizations(Object.assign({}, cc, { [themeItem]: colorManip_1.ColorManip.adjustColor(handlersPickers_1.parseHex(item), saturation, lightness).hex() }));
                }
            })
        };
        let selection = yield vscode.window.showQuickPick([Constants_1.C.default, ...colorPickerArrays_1.DropdownArrays.color], options);
        if (selection === undefined) {
            yield tools_1.Tools.setColorCustomizations(ccInit);
        }
        if (selection === Constants_1.C.default) {
            yield tools_1.Tools.removeCustomThemeItem(themeItem);
        }
        else {
            yield tools_1.Tools.setCustomThemeItem(themeItem, { [Constants_1.C.customThemeBaseColor]: handlersPickers_1.parseHex(selection), [Constants_1.C.customThemeSaturation]: saturation, [Constants_1.C.customThemeLightness]: lightness });
        }
    });
}
function selectSaturation(themeItem, basecolor, saturation, lightness, cc, ccInit) {
    return __awaiter(this, void 0, void 0, function* () {
        if (basecolor === undefined) {
            messages_1.Errors.customEditorUndefinedBasecolor(themeItem);
            return;
        }
        const options = {
            placeHolder: 'Select saturation level for ' + themeItem,
            onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                yield tools_1.Tools.setColorCustomizations(Object.assign({}, cc, { [themeItem]: colorManip_1.ColorManip.adjustColor(basecolor, parseFloat(selection), lightness).hex() }));
            })
        };
        let selection = yield vscode.window.showQuickPick(colorPickerArrays_1.DropdownArrays.saturation, options);
        if (selection === undefined) {
            yield tools_1.Tools.setColorCustomizations(ccInit);
            return;
        }
        yield tools_1.Tools.setCustomThemeItem(themeItem, { [Constants_1.C.customThemeBaseColor]: basecolor, [Constants_1.C.customThemeSaturation]: parseFloat(selection), [Constants_1.C.customThemeLightness]: lightness });
    });
}
function selectLightness(themeItem, basecolor, saturation, lightness, cc, ccInit) {
    return __awaiter(this, void 0, void 0, function* () {
        if (basecolor === undefined) {
            messages_1.Errors.customEditorUndefinedBasecolor(themeItem);
            return;
        }
        const options = {
            placeHolder: 'Select lightness level for ' + themeItem,
            onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                yield tools_1.Tools.setColorCustomizations(Object.assign({}, cc, { [themeItem]: colorManip_1.ColorManip.adjustColor(basecolor, saturation, parseFloat(selection)).hex() }));
            })
        };
        let selection = yield vscode.window.showQuickPick(colorPickerArrays_1.DropdownArrays.lightness, options);
        if (selection === undefined) {
            yield tools_1.Tools.setColorCustomizations(ccInit);
            return;
        }
        yield tools_1.Tools.setCustomThemeItem(themeItem, { [Constants_1.C.customThemeBaseColor]: basecolor, [Constants_1.C.customThemeSaturation]: saturation, [Constants_1.C.customThemeLightness]: parseFloat(selection) });
    });
}
function themeEditorHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        let ccInit = tools_1.Tools.getColorCustomizations();
        let s = tools_1.Tools.getInternalSettingsObject();
        let ccDefault = s[Constants_1.C.BaseColor] ? tools_1.Tools.buildNonCustomCc(s) : {};
        const highlightColor = getHighlightColor();
        const options = {
            placeHolder: 'Select a theme item to color',
            onDidSelectItem: (themeItem) => __awaiter(this, void 0, void 0, function* () {
                yield tools_1.Tools.setColorCustomizations(Object.assign({}, ccInit, { [themeItem]: highlightColor }));
            })
        };
        let themeItem = yield vscode.window.showQuickPick([Constants_1.C.REMOVE_ALL_CUST_THEME_MODS, ...colorPickerArrays_1.DropdownArrays.themeItems], options);
        if (themeItem === undefined) {
            yield tools_1.Tools.setColorCustomizations(ccInit);
            return;
        }
        if (themeItem === Constants_1.C.REMOVE_ALL_CUST_THEME_MODS) {
            yield tools_1.Tools.setInternalSetting(Constants_1.C.customThemeMap, {});
            return;
        }
        let selection = yield vscode.window.showQuickPick([Constants_1.C.ENTER_COLOR, Constants_1.C.SELECT_COLOR, Constants_1.C.SELECT_SAT, Constants_1.C.SELECT_LIGHTNESS, Constants_1.C.REMOVE_COLOR], {
            placeHolder: themeItem + ' color editor',
            onDidSelectItem: (selection) => __awaiter(this, void 0, void 0, function* () {
                if (selection === Constants_1.C.REMOVE_COLOR) {
                    yield tools_1.Tools.setColorCustomizations(ccDefault); //remove the highlighting
                }
                else {
                    yield tools_1.Tools.setColorCustomizations(Object.assign({}, ccInit, { [themeItem]: highlightColor }));
                }
            })
        });
        if (selection === undefined) {
            yield tools_1.Tools.setColorCustomizations(ccInit); //remove the highlighting
            return;
        }
        yield tools_1.Tools.setColorCustomizations(ccInit); //remove the highlighting
        if (selection === Constants_1.C.ENTER_COLOR) {
            yield setColorFromPrompt(themeItem);
        }
        else {
            let customThemeMap = tools_1.Tools.getInternalSetting(Constants_1.C.customThemeMap);
            let lightness = tools_1.Tools.getCustomThemeItemLightnessFromMap(customThemeMap, themeItem);
            let saturation = tools_1.Tools.getCustomThemeItemSaturationFromMap(customThemeMap, themeItem);
            let basecolor = themeItem in customThemeMap && Constants_1.C.customThemeBaseColor in customThemeMap[themeItem] ?
                customThemeMap[themeItem][Constants_1.C.customThemeBaseColor] :
                undefined;
            const cc = tools_1.Tools.getColorCustomizations();
            switch (selection) {
                case Constants_1.C.SELECT_COLOR:
                    yield selectColor(themeItem, basecolor, saturation, lightness, cc, ccDefault, ccInit);
                    break;
                case Constants_1.C.SELECT_SAT:
                    yield selectSaturation(themeItem, basecolor, saturation, lightness, cc, ccInit);
                    break;
                case Constants_1.C.SELECT_LIGHTNESS:
                    yield selectLightness(themeItem, basecolor, saturation, lightness, cc, ccInit);
                    break;
                case Constants_1.C.REMOVE_COLOR:
                    yield tools_1.Tools.removeCustomThemeItem(themeItem);
                    break;
            }
        }
        function getHighlightColor() {
            let highlightColor = '#ff0000';
            if (tools_1.Tools.getTheme().toLowerCase().includes('red')) {
                highlightColor = '#00ff00';
            }
            return highlightColor;
        }
    });
}
exports.themeEditorHandler = themeEditorHandler;
//# sourceMappingURL=handlerThemeEditor.js.map