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
/**
 * display portfolios.  set selection to automaticColorsPortfolio
 * put checkmark by the name of the selected portfolio (use )
 */
function automaticColorsHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        const initPortfolio = tools_1.Tools.getSetting(Constants_1.C.AutomaticColorsPortfolio);
        const initSelected = tools_1.Tools.getInternalSetting(Constants_1.C.useAutomatic) && initPortfolio;
        const doOverwriteInit = tools_1.Tools.getSetting(Constants_1.C.overwriteAllWorkspaceColorsWithAutomaticPortfolio);
        const PORTFOLIOS = 'Portfolios - Select the automatic colors source and randomly color this workspace.';
        const OVERWRITE_WORKSPACES = 'Overwrite all workspace colors? ' + (doOverwriteInit ? `(yes, portfolio: ${initPortfolio})` : `(no)`);
        let selection = yield vscode.window.showQuickPick([PORTFOLIOS, OVERWRITE_WORKSPACES], { placeHolder: 'Automatic Colors Menu' });
        if (selection === undefined) {
            return;
        }
        switch (selection) {
            case PORTFOLIOS:
                let portfolioOptions = [Constants_1.C.Automatic, ...yield library_1.Library.getPortfoliosNames()];
                let portfolioNames = tools_1.Tools.checkElement(initSelected, portfolioOptions);
                portfolioOptions[0] += ' ("Light" or "Dusty" depending on theme)';
                if (portfolioNames.length === 0) {
                    messages_1.Errors.noPortfoliosFound();
                    return;
                }
                let portfolioName = yield vscode.window.showQuickPick(portfolioNames, { placeHolder: PORTFOLIOS });
                if (portfolioName === undefined) {
                    return;
                }
                portfolioName = tools_1.Tools.trim(portfolioName.replace('✅', ''));
                if (portfolioName.includes(Constants_1.C.Automatic)) {
                    yield tools_1.Tools.setGlobalSetting(Constants_1.C.AutomaticColorsPortfolio, Constants_1.C.Automatic);
                    yield tools_1.Tools.installAutomaticColoration();
                    return;
                }
                const colorations = library_1.Library.getColorationNamesInPortfolio(portfolioName);
                if (colorations.length < 2) {
                    messages_1.Errors.notEnoughPortfolioColors(portfolioName, colorations);
                    return;
                }
                yield tools_1.Tools.setGlobalSetting(Constants_1.C.AutomaticColorsPortfolio, portfolioName);
                yield tools_1.Tools.installAutomaticColoration();
                break;
            case OVERWRITE_WORKSPACES:
                let selection = yield vscode.window.showQuickPick([`Current value (${doOverwriteInit === true ? 'yes' : 'no'})`, 'yes', 'no'], { placeHolder: OVERWRITE_WORKSPACES + '(requires reload)' });
                if (selection === undefined) {
                    return;
                }
                yield tools_1.Tools.setGlobalSetting(Constants_1.C.overwriteAllWorkspaceColorsWithAutomaticPortfolio, selection.includes('yes'));
                break;
        }
    });
}
exports.automaticColorsHandler = automaticColorsHandler;
//# sourceMappingURL=handlerAutomaticColors.js.map