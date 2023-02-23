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
const messages_1 = require("./messages");
const library_1 = require("./library");
const tools_1 = require("./tools");
const animation_1 = require("./animation");
/*
Library
- load colors
- save colors
- delete colors
- new portfolio
- delete portfolio
- add base colors to portfolio (accept list of colors)
--- portfolio dropdown
--- colors input
*/
/**  show portfolios dropdown then colors dropdown */
function loadColors() {
    return __awaiter(this, void 0, void 0, function* () {
        const isInit = tools_1.Tools.getSetting(Constants_1.C.internalSettings);
        const portfolioNames = yield library_1.Library.getPortfoliosNames();
        if (portfolioNames.length === 0) {
            messages_1.Errors.noPortfoliosFound();
        }
        const portfolioName = yield vscode.window.showQuickPick(portfolioNames, { placeHolder: 'Select portfolio' });
        if (portfolioName === undefined) {
            return;
        }
        const myGlobalData = tools_1.Tools.getSetting(Constants_1.C.myGlobalData);
        let colorationNames = yield library_1.Library.getColorationNamesInPortfolio(portfolioName);
        for (let i = 0; i < colorationNames.length; i++) {
            if (myGlobalData[Constants_1.C.portfolios][portfolioName][colorationNames[i]][Constants_1.C.animationDoAnimate]) {
                colorationNames[i] += '  ' + Constants_1.C.projectorEmoji;
            }
        }
        const options = {
            placeHolder: 'Select a coloration',
            onDidSelectItem: (coloration) => __awaiter(this, void 0, void 0, function* () {
                if (isInit[Constants_1.C.animationDoAnimate]) {
                    animation_1.A.doAnimate = false;
                }
                coloration = coloration.replace(Constants_1.C.projectorEmoji, '').trim();
                yield library_1.Library.demoColoration(portfolioName, coloration, true, myGlobalData);
            })
        };
        let coloration = yield vscode.window.showQuickPick(colorationNames, options);
        if (coloration === undefined) {
            const cc = tools_1.Tools.buildCcFromInternalSettings(isInit);
            yield tools_1.Tools.setColorCustomizations(cc);
            if (isInit[Constants_1.C.animationDoAnimate] && animation_1.A.doAnimate === false) {
                yield animation_1.animate(isInit[Constants_1.C.animationGradientInputStr]); //Tools.setInternalSetting(C.animationDoAnimate, false);
            }
        }
        else {
            coloration = coloration.replace(Constants_1.C.projectorEmoji, '').trim();
            yield library_1.Library.loadColoration(portfolioName, coloration);
        }
    });
}
/**  show portfolios dropdown then new colors input box */
function saveColoration() {
    return __awaiter(this, void 0, void 0, function* () {
        //TODO - show message if there are no portfolios colors to load
        const portfolioName = yield vscode.window.showQuickPick(yield library_1.Library.getPortfoliosNames(), { placeHolder: 'Select portfolio' });
        if (portfolioName === undefined) {
            return;
        }
        const options = {
            placeHolder: 'Save Coloration',
            prompt: 'Enter new coloration name.'
        };
        const colorationName = yield vscode.window.showInputBox(options);
        if (colorationName === undefined) {
            return;
        }
        yield library_1.Library.saveColors(portfolioName, colorationName);
    });
}
/**  show portfolios dropdown then colors dropdown */
function deleteColors() {
    return __awaiter(this, void 0, void 0, function* () {
        //TODO - show message if there are no portfolios colors to load
        const currInternalSettings = tools_1.Tools.getInternalSettingsObject();
        const portfolioName = yield vscode.window.showQuickPick(yield library_1.Library.getPortfoliosNames(), { placeHolder: 'Select portfolio' });
        if (portfolioName === undefined) {
            return;
        }
        const options = {
            placeHolder: 'Select a coloration',
            onDidSelectItem: (coloration) => __awaiter(this, void 0, void 0, function* () {
                library_1.Library.loadColoration(portfolioName, coloration);
            })
        };
        const colorationName = yield vscode.window.showQuickPick(yield library_1.Library.getColorationNamesInPortfolio(portfolioName), options);
        if (colorationName !== undefined) {
            yield library_1.Library.deleteColors(portfolioName, colorationName);
        }
        yield tools_1.Tools.setSetting(Constants_1.C.internalSettings, currInternalSettings);
    });
}
/** // single input box */
function newPortfolio() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            placeHolder: 'New Portfolio',
            prompt: 'Enter new portfolio name.'
        };
        const portfolioName = yield vscode.window.showInputBox(options);
        if (portfolioName === undefined) {
            return;
        }
        if (portfolioName.toLocaleLowerCase().includes(Constants_1.C.Automatic.toLowerCase())) {
            vscode.window.showErrorMessage("Portfolio names can't contain the reserved word 'automatic'.");
            return;
        }
        yield library_1.Library.createNewPortfolio(portfolioName);
    });
}
/**  show portfolios dropdown then new colors input box */
function deletePortfolio() {
    return __awaiter(this, void 0, void 0, function* () {
        const portfolioName = yield vscode.window.showQuickPick(yield library_1.Library.getPortfoliosNames(), { placeHolder: 'Select portfolio' });
        if (portfolioName === undefined) {
            return;
        }
        yield library_1.Library.deletePortfolio(portfolioName);
    });
}
/**  show portfolios dropdown then new colors input box */
function addMultipleColorsToPortfolio() {
    return __awaiter(this, void 0, void 0, function* () {
        let portfolioName = yield vscode.window.showQuickPick(yield library_1.Library.getPortfoliosNames(), { placeHolder: 'Select portfolio' });
        if (portfolioName === undefined) {
            return;
        }
        portfolioName = tools_1.Tools.trim(portfolioName);
        const options = {
            placeHolder: 'Html color names or hex values.',
            prompt: 'Enter base colors separated by spaces.'
        };
        let colorsStr = yield vscode.window.showInputBox(options);
        if (colorsStr === undefined) {
            return;
        }
        colorsStr = tools_1.Tools.trim(colorsStr);
        yield library_1.Library.generateColorationsInPortfolio(colorsStr, portfolioName);
    });
}
//TODO rewrite from portfolio handler
function libraryHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const LOAD_COLORS = "Load Colors";
        const SAVE_COLORATION = "Save Colors";
        const DELETE_COLORS = "Delete Colors";
        const NEW_PORTFOLIO = "New Portfolio";
        const DELETE_PORTFOLIO = "Delete Portfolio";
        const ADD_MULTIPLE_COLORS_TO_PORTFOLIO = "Add Multiple Colors To Portfolio";
        const selection = yield vscode.window.showQuickPick([LOAD_COLORS, SAVE_COLORATION, DELETE_COLORS, NEW_PORTFOLIO, DELETE_PORTFOLIO, ADD_MULTIPLE_COLORS_TO_PORTFOLIO], { placeHolder: 'Colors Library' });
        switch (selection) {
            case LOAD_COLORS:
                loadColors(); // show portfolios dropdown then colors dropdown
                break;
            case SAVE_COLORATION:
                saveColoration(); // show portfolios dropdown then new colors input box
                break;
            case DELETE_COLORS:
                deleteColors(); // show portfolios dropdown then colors dropdown
                break;
            case NEW_PORTFOLIO:
                newPortfolio(); // single input box
                break;
            case DELETE_PORTFOLIO:
                deletePortfolio(); // show portfolios dropdown 
                break;
            case ADD_MULTIPLE_COLORS_TO_PORTFOLIO:
                addMultipleColorsToPortfolio(); // show portfolios dropdown then input box
                break;
        }
    });
}
exports.libraryHandler = libraryHandler;
//# sourceMappingURL=handlerLibrary.js.map