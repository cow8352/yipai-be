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
                ignoreFocusOut: true,
                placeHolder: 'hex code or html name (eg "#abcd00" or "whitesmoke")',
                prompt: 'Enter a background color',
                value: '' //await Tools.getSetting(C.activityBar_background)
            };
            const inputColor = yield vscode.window.showInputBox(options);
            tools_1.Tools.setSetting(Constants_1.C.BackgroundLightness, 0);
            tools_1.Tools.setSetting(Constants_1.C.BackgroundSaturation, 1);
            tools_1.Tools.setSetting(Constants_1.C.BaseColor, Color(inputColor).hex());
        });
    }
    static enterForegroundColorHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                ignoreFocusOut: true,
                placeHolder: 'hex code or html name (eg "#abcd00" or "whitesmoke")',
                prompt: 'Enter a foreground (text etc) color',
                value: '' //await Tools.getSetting(C.activityBar_foreground)
            };
            const inputColor = yield vscode.window.showInputBox(options);
            tools_1.Tools.setSetting(Constants_1.C.UseCustomForegroundColor, true);
            tools_1.Tools.setSetting(Constants_1.C.ForegroundLightness, 0);
            tools_1.Tools.setSetting(Constants_1.C.ForegroundSaturation, 1);
            tools_1.Tools.setSetting(Constants_1.C.ForegroundBaseColor, Color(inputColor).hex());
        });
    }
}
exports.Prompts = Prompts;
//# sourceMappingURL=promptHandlers.js.map