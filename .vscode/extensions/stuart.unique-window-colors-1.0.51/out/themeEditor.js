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
function getThemeItemFromDropdown(ccInit) {
    return __awaiter(this, void 0, void 0, function* () {
        let highlightColor = '#ff0000';
        if (tools_1.Tools.getTheme().toLowerCase().includes('red')) {
            highlightColor = '#00ff00';
        }
        const options = {
            placeHolder: 'Select a theme item to color',
            onDidSelectItem: (item) => __awaiter(this, void 0, void 0, function* () {
                yield tools_1.Tools.setColorCustomizations(Object.assign({}, ccInit, { [item]: highlightColor }));
            })
        };
        let themeItem = yield vscode.window.showQuickPick(['Remove all custom theme modifications', ...colorPickerArrays_1.DropdownArrays.themeItems], options);
        return themeItem;
    });
}
function getTopLevelMenuSelection(ccInit, themeItem, menuItems) {
    return __awaiter(this, void 0, void 0, function* () {
        if (themeItem === 'Remove all custom theme modifications') {
            yield tools_1.Tools.setInternalSetting(Constants_1.C.customThemeMap, {});
            return;
        }
        yield tools_1.Tools.setColorCustomizations(ccInit);
        let selection = yield vscode.window.showQuickPick(menuItems, { placeHolder: themeItem + ' color editor' });
        return selection;
    });
}
function setColorFromPrompt(themeItem) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputColor = yield vscode.window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: 'hex code or html name (eg "#abcd00" or "whitesmoke")',
            prompt: `Enter a color for ${themeItem}`
        });
        const hex = Color(inputColor).hex();
        yield tools_1.Tools.setCustomThemeItem(themeItem, { [Constants_1.C.customThemeBaseColor]: hex, [Constants_1.C.customThemeSaturation]: Constants_1.C.defaultSaturation, [Constants_1.C.customThemeLightness]: Constants_1.C.defaultLightness });
    });
}
function selectColor(themeItem, basecolor, saturation, lightness, cc, ccDefault) {
    return __awaiter(this, void 0, void 0, function* () {
        //TODO - remove on hover default
        const currentSetting = Constants_1.C.CURR_SET + basecolor;
        const options = {
            placeHolder: 'Select a color for ' + themeItem,
            onDidSelectItem: (item) => __awaiter(this, void 0, void 0, function* () {
                item = item.replace(Constants_1.C.CURR_SET, '');
                if (item === Constants_1.C.default) {
                    yield tools_1.Tools.setColorCustomizations(ccDefault);
                }
                else {
                    yield tools_1.Tools.setColorCustomizations(Object.assign({}, cc, { [themeItem]: colorManip_1.ColorManip.adjustColor(handlersPickers_1.getHexFromHueDropdown(item), saturation, lightness).hex() }));
                }
            })
        };
        let selection = yield vscode.window.showQuickPick([currentSetting, Constants_1.C.default, ...colorPickerArrays_1.DropdownArrays.color], options);
        if (selection === Constants_1.C.default) {
            yield tools_1.Tools.removeCustomThemeItem(themeItem);
        }
        else {
            yield tools_1.Tools.setCustomThemeItem(themeItem, { [Constants_1.C.customThemeBaseColor]: handlersPickers_1.getHexFromHueDropdown(selection), [Constants_1.C.customThemeSaturation]: saturation, [Constants_1.C.customThemeLightness]: lightness });
        }
    });
}
function selectSaturation(themeItem, basecolor, saturation, lightness, cc) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentSetting = Constants_1.C.CURR_SET + saturation;
        const options = {
            placeHolder: 'Select saturation level for ' + themeItem,
            onDidSelectItem: (x) => __awaiter(this, void 0, void 0, function* () {
                x = x.replace(Constants_1.C.CURR_SET, '');
                saturation = x === Constants_1.C.default ? Constants_1.C.defaultSaturation : parseFloat(x);
                console.log("in onDidSelectItem: base: " + basecolor + ', sat: ' + saturation + ', lightness: ' + lightness);
                yield tools_1.Tools.setColorCustomizations(Object.assign({}, cc, { [themeItem]: colorManip_1.ColorManip.adjustColor(basecolor, saturation, lightness).hex() }));
            })
        };
        let selection = yield vscode.window.showQuickPick([currentSetting, Constants_1.C.default, ...colorPickerArrays_1.DropdownArrays.saturation], options);
        selection = selection.replace(Constants_1.C.CURR_SET, '');
        saturation = selection === Constants_1.C.default ? Constants_1.C.defaultSaturation : parseFloat(selection);
        yield tools_1.Tools.setCustomThemeItem(themeItem, { [Constants_1.C.customThemeBaseColor]: basecolor, [Constants_1.C.customThemeSaturation]: saturation, [Constants_1.C.customThemeLightness]: lightness });
    });
}
function selectLightness(themeItem, basecolor, saturation, lightness, cc) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentSetting = Constants_1.C.CURR_SET + saturation;
        const options = {
            placeHolder: 'Select lightness level for ' + themeItem,
            onDidSelectItem: (x) => __awaiter(this, void 0, void 0, function* () {
                x = x.replace(Constants_1.C.CURR_SET, '');
                lightness = x === Constants_1.C.default ? Constants_1.C.defaultLightness : parseFloat(x);
                console.log("in onDidSelectItem: base: " + basecolor + ', sat: ' + saturation + ', lightness: ' + lightness);
                yield tools_1.Tools.setColorCustomizations(Object.assign({}, cc, { [themeItem]: colorManip_1.ColorManip.adjustColor(basecolor, saturation, lightness).hex() }));
            })
        };
        let selection = yield vscode.window.showQuickPick([currentSetting, Constants_1.C.default, ...colorPickerArrays_1.DropdownArrays.saturation], options);
        selection = selection.replace(Constants_1.C.CURR_SET, '');
        lightness = selection === Constants_1.C.default ? Constants_1.C.defaultLightness : parseFloat(selection);
        yield tools_1.Tools.setCustomThemeItem(themeItem, { [Constants_1.C.customThemeBaseColor]: basecolor, [Constants_1.C.customThemeSaturation]: saturation, [Constants_1.C.customThemeLightness]: lightness });
    });
}
/** TODO - switch to default when hover over default. */
function themeEditorHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        let ccInit = tools_1.Tools.getColorCustomizations();
        let ccDefault = tools_1.Tools.buildNonCustomCc();
        let themeItem = yield getThemeItemFromDropdown(ccInit);
        const menuItems = [Constants_1.C.ENTER_COLOR, Constants_1.C.SELECT_COLOR, Constants_1.C.SELECT_SAT, Constants_1.C.SELECT_LIGHTNESS, Constants_1.C.REMOVE_COLOR];
        let selection = yield getTopLevelMenuSelection(ccInit, themeItem, menuItems);
        if (selection === 'Enter color') {
            yield setColorFromPrompt(themeItem);
        }
        else {
            //for pickers, first option should be 'Default'
            //don't store this stuff anywhere?  uh we have to for saturation adn lightness to work :(  is that stupid?  
            //so .... we have to store object of customThemeMap (item: color, saturation, lightness)
            let customThemeMap = tools_1.Tools.getInternalSetting(Constants_1.C.customThemeMap);
            let lightness = tools_1.Tools.getCustomThemeItemLightnessFromMap(customThemeMap, themeItem);
            let saturation = tools_1.Tools.getCustomThemeItemSaturationFromMap(customThemeMap, themeItem);
            let basecolor = themeItem in customThemeMap && Constants_1.C.customThemeBaseColor in customThemeMap[themeItem] ?
                customThemeMap[themeItem][Constants_1.C.customThemeBaseColor] :
                Constants_1.C.default;
            const cc = tools_1.Tools.getColorCustomizations();
            if (selection === Constants_1.C.SELECT_COLOR) {
                yield selectColor(themeItem, basecolor, saturation, lightness, cc, ccDefault);
            }
            else if (selection === Constants_1.C.SELECT_SAT) {
                yield selectSaturation(themeItem, basecolor, saturation, lightness, cc);
            }
            else if (selection === Constants_1.C.SELECT_LIGHTNESS) {
                yield selectLightness(themeItem, basecolor, saturation, lightness, cc);
            }
            else if (selection === Constants_1.C.REMOVE_COLOR) {
                yield tools_1.Tools.removeCustomThemeItem(themeItem);
            }
        }
    });
}
exports.themeEditorHandler = themeEditorHandler;
//# sourceMappingURL=themeEditor.js.map