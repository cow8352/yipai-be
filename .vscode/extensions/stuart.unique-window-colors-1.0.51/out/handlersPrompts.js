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
const Constants_1 = require("./Constants");
const tools_1 = require("./tools");
class Prompts {
    static enterBackgroundColorHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                placeHolder: 'hex code or html name (eg "#abcd00" or "whitesmoke")',
                prompt: 'Enter a background color',
                value: ''
            };
            const inputColor = yield vscode.window.showInputBox(options);
            if (inputColor === undefined) {
                return;
            }
            yield tools_1.Tools.attemptToSetBackgroundBaseColor(inputColor);
        });
    }
    static enterForegroundColorHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                placeHolder: 'hex code or html name (eg "#abcd00" or "whitesmoke")',
                prompt: 'Enter a foreground (text etc) color',
                value: ''
            };
            const inputColor = yield vscode.window.showInputBox(options);
            if (inputColor === undefined) {
                return;
            }
            if (!tools_1.Tools.isValidColor(inputColor)) {
                vscode.window.showErrorMessage(`"${inputColor}" is not a valid color.`);
            }
            else {
                yield tools_1.Tools.setInternalSettings({
                    [Constants_1.C.UseCustomForegroundColor]: true,
                    [Constants_1.C.ForegroundLightness]: Constants_1.C.defaultLightness,
                    [Constants_1.C.ForegroundSaturation]: Constants_1.C.defaultSaturation,
                    [Constants_1.C.ForegroundBaseColor]: Color(inputColor).hex(),
                    [Constants_1.C.portfolioAndColor]: undefined,
                    [Constants_1.C.useAutomatic]: undefined
                });
            }
        });
    }
}
exports.Prompts = Prompts;
//# sourceMappingURL=handlersPrompts.js.map