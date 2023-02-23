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
const Constants_1 = require("./Constants");
const tools_1 = require("./tools");
const messages_1 = require("./messages");
const animation_1 = require("./animation");
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////  Library  /////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Library {
    /** portfolio must exist.
     *
     * "Colors" in this context is everything in internalSettings. including theme.
     *
     * NOT including ModifyBar flags.
     *
     * include animation parameters - steps per transition and ms per step
     *
     */
    static saveColors(portfolioName, colorationName) {
        return __awaiter(this, void 0, void 0, function* () {
            let c = tools_1.Tools.getExtensionSettings();
            yield Library.saveInputColors(portfolioName, colorationName, c[Constants_1.C.internalSettings]);
        });
    }
    static saveInputColors(portfolioName, colorationName, internalSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            const myGlobalData = tools_1.Tools.getSetting(Constants_1.C.myGlobalData);
            if (!myGlobalData[Constants_1.C.portfolios] || !myGlobalData[Constants_1.C.portfolios][portfolioName]) {
                vscode.window.showErrorMessage(`Portfolio "${portfolioName}" not found.`);
                return;
            }
            if (myGlobalData[Constants_1.C.portfolios][portfolioName][colorationName]) {
                vscode.window.showErrorMessage(`Colors "${colorationName}" in portfolio "${portfolioName}" already exists.`);
                return;
            }
            let updatedIntSettings = Object.assign({}, internalSettings);
            myGlobalData[Constants_1.C.portfolios][portfolioName][colorationName] = updatedIntSettings;
            yield tools_1.Tools.setGlobalSetting(Constants_1.C.myGlobalData, myGlobalData);
        });
    }
    static loadColoration(portfolioName, colorationName, wasSetAutomatically) {
        return __awaiter(this, void 0, void 0, function* () {
            const myGlobalData = tools_1.Tools.getSetting(Constants_1.C.myGlobalData);
            if (!myGlobalData[Constants_1.C.portfolios]
                || !myGlobalData[Constants_1.C.portfolios][portfolioName]
                || !myGlobalData[Constants_1.C.portfolios][portfolioName][colorationName]) {
                messages_1.Errors.colorationNotFound(portfolioName, colorationName);
                return;
            }
            let internalSettings = myGlobalData[Constants_1.C.portfolios][portfolioName][colorationName];
            internalSettings = tools_1.Tools.deblack(internalSettings);
            internalSettings[Constants_1.C.portfolioAndColor] = { [Constants_1.C.portfolio]: portfolioName, [Constants_1.C.coloration]: colorationName };
            if (wasSetAutomatically) {
                internalSettings[Constants_1.C.useAutomatic] = true;
            }
            yield tools_1.Tools.setSetting(Constants_1.C.internalSettings, internalSettings);
            if (internalSettings[Constants_1.C.animationDoAnimate]) {
                yield animation_1.animate(internalSettings[Constants_1.C.animationGradientInputStr]);
            }
        });
    }
    /** use this while scrolling.  demo custom theme bits too. */
    static demoColoration(portfolioName, colorationName, wasSetAutomatically, myGlobalData) {
        return __awaiter(this, void 0, void 0, function* () {
            //how to demo custom theme bits ... ?
            if (!myGlobalData[Constants_1.C.portfolios]
                || !myGlobalData[Constants_1.C.portfolios][portfolioName]
                || !myGlobalData[Constants_1.C.portfolios][portfolioName][colorationName]) {
                messages_1.Errors.colorationNotFound(portfolioName, colorationName);
                return;
            }
            let internalSettings = myGlobalData[Constants_1.C.portfolios][portfolioName][colorationName];
            internalSettings = tools_1.Tools.deblack(internalSettings);
            internalSettings[Constants_1.C.portfolioAndColor] = { [Constants_1.C.portfolio]: portfolioName, [Constants_1.C.coloration]: colorationName };
            if (wasSetAutomatically) {
                internalSettings[Constants_1.C.useAutomatic] = true;
            }
            //don't demo animations
            if (internalSettings[Constants_1.C.animationDoAnimate]) {
                return;
            }
            let cc = tools_1.Tools.buildCcFromInternalSettings(internalSettings);
            cc = tools_1.Tools.addCustomThemeColors(internalSettings, cc);
            yield tools_1.Tools.setColorCustomizations(cc);
        });
    }
    static deleteColors(portfolioName, colorationName) {
        return __awaiter(this, void 0, void 0, function* () {
            const myGlobalData = tools_1.Tools.getSetting(Constants_1.C.myGlobalData);
            if (!myGlobalData[Constants_1.C.portfolios]
                || !myGlobalData[Constants_1.C.portfolios][portfolioName]
                || !myGlobalData[Constants_1.C.portfolios][portfolioName][colorationName]) {
                vscode.window.showErrorMessage(`Colors "${colorationName} in portfolio "${portfolioName}" not found.`);
                return;
            }
            delete myGlobalData[Constants_1.C.portfolios][portfolioName][colorationName];
            yield tools_1.Tools.setGlobalSetting(Constants_1.C.myGlobalData, myGlobalData);
        });
    }
    static createNewPortfolio(portfolioName) {
        return __awaiter(this, void 0, void 0, function* () {
            const myGlobalData = tools_1.Tools.getSetting(Constants_1.C.myGlobalData);
            if (!myGlobalData[Constants_1.C.portfolios]) {
                myGlobalData[Constants_1.C.portfolios] = {};
            }
            if (myGlobalData[Constants_1.C.portfolios][portfolioName]) {
                vscode.window.showErrorMessage(`Portfolio "${portfolioName}" already exists.`);
                return;
            }
            myGlobalData[Constants_1.C.portfolios][portfolioName] = {};
            yield tools_1.Tools.setGlobalSetting(Constants_1.C.myGlobalData, myGlobalData);
        });
    }
    static deletePortfolio(portfolioName) {
        return __awaiter(this, void 0, void 0, function* () {
            const myGlobalData = tools_1.Tools.getSetting(Constants_1.C.myGlobalData);
            if (!myGlobalData[Constants_1.C.portfolios] || !myGlobalData[Constants_1.C.portfolios][portfolioName]) {
                vscode.window.showErrorMessage(`Portfolio "${portfolioName}" not found.`);
                return;
            }
            delete myGlobalData[Constants_1.C.portfolios][portfolioName];
            yield tools_1.Tools.setGlobalSetting(Constants_1.C.myGlobalData, myGlobalData);
        });
    }
    static getPortfoliosNames() {
        const myGlobalData = tools_1.Tools.getSetting(Constants_1.C.myGlobalData);
        return myGlobalData[Constants_1.C.portfolios] ? Object.keys(myGlobalData[Constants_1.C.portfolios]) || [] : [];
    }
    static getColorationNamesInPortfolio(portfolioName) {
        const myGlobalData = tools_1.Tools.getSetting(Constants_1.C.myGlobalData);
        if (!myGlobalData[Constants_1.C.portfolios] || !myGlobalData[Constants_1.C.portfolios][portfolioName]) {
            vscode.window.showErrorMessage(`Portfolio "${portfolioName}" not found.`);
            return [];
        }
        return Object.keys(myGlobalData[Constants_1.C.portfolios][portfolioName]) || [];
    }
    /** do NOT save theme here.  preset portfolios should not include theme either in the internalSettings object.
     *
     * DO NOT save animation stuff.
     *
     * use automatic font colors here
     *
     * so, code (when loading) needs to check if internalSettings has theme key.  if so, use.  if not, use default
     */
    static generateColorationsInPortfolio(colorsStr, portfolioName) {
        return __awaiter(this, void 0, void 0, function* () {
            const colors = colorsStr.split(' ');
            const existingColorationNames = Library.getColorationNamesInPortfolio(portfolioName);
            for (let i = 0; i < colors.length; i++) {
                const basecolor = colors[i];
                if (!tools_1.Tools.isValidColor(basecolor)) {
                    vscode.window.showErrorMessage(`Aborting colors generation: "${basecolor}" is not a valid color.`);
                    return;
                }
                if (basecolor in existingColorationNames) {
                    vscode.window.showErrorMessage(`Aborting colors generation: "${basecolor}" is already in portfolio "${portfolioName}".`);
                    return;
                }
            }
            for (let i = 0; i < colors.length; i++) {
                const basecolor = colors[i];
                yield Library.saveInputColors(portfolioName, basecolor, { [Constants_1.C.BaseColor]: basecolor });
            }
        });
    }
}
exports.Library = Library;
//# sourceMappingURL=library.js.map