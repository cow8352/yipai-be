"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Errors {
    static notYetSupported(arg0) {
        vscode.window.showErrorMessage("Not yet supported: " + arg0);
    }
    static notEnoughPortfolioColors(portfolioName, colorations) {
        vscode.window.showErrorMessage(`Portfolios needs at least 2 colors to be used for automatic workspace coloring. "${portfolioName}" currently has ${colorations.length}.  Add some to it via the "Window Colors: Library" command.`);
    }
    static automaticPortfolioNotSet() {
        vscode.window.showErrorMessage(`Select a portfolio for the setting "Automatic Colors Portfolio" via vscode settings or the command palette ("Window Colors: Automatic Colors")`);
    }
    static customEditorUndefinedBasecolor(themeItem) {
        vscode.window.showWarningMessage(`Please set a base color first for ${themeItem}.`);
    }
    static invalidColor(color) {
        vscode.window.showErrorMessage(`"${color}" is not a valid color.`);
    }
    static colorationNotFound(portfolioName, colorationName) {
        vscode.window.showErrorMessage(`Colors "${colorationName}" in portfolio "${portfolioName}" not found.`);
    }
    static noPortfoliosFound() {
        vscode.window.showErrorMessage(`No portfolios found.  Reinstall the extension or create your own from the "Window Colors: Library" command.`);
    }
    static pleaseReload() {
        vscode.window.showWarningMessage('Please reload the window now (Command Palette → "Reload Window"). If you would like to use this extension without the main bar colors, use the "Set Modified Areas" command.');
    }
}
exports.Errors = Errors;
//# sourceMappingURL=messages.js.map