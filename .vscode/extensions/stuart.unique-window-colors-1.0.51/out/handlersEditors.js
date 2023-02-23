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
const handlersPickers_1 = require("./handlersPickers");
const handlersPrompts_1 = require("./handlersPrompts");
class Editors {
    static backgroundEditorHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            let selection = yield vscode.window.showQuickPick([Constants_1.C.ENTER_COLOR, Constants_1.C.SELECT_COLOR, Constants_1.C.SELECT_SAT, Constants_1.C.SELECT_LIGHTNESS], { placeHolder: 'Background Color Editor', });
            if (selection === 'Enter color') {
                yield handlersPrompts_1.Prompts.enterBackgroundColorHandler();
            }
            else {
                if (selection === Constants_1.C.SELECT_COLOR) {
                    yield handlersPickers_1.Pickers.backgroundColorPickerHueHandler();
                }
                else if (selection === Constants_1.C.SELECT_SAT) {
                    yield handlersPickers_1.Pickers.backgroundColorPickerSaturationHandler();
                }
                else if (selection === Constants_1.C.SELECT_LIGHTNESS) {
                    yield handlersPickers_1.Pickers.backgroundColorPickerLightnessHandler();
                }
            }
        });
    }
    static foregroundEditorHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            let selection = yield vscode.window.showQuickPick([Constants_1.C.ENTER_COLOR, Constants_1.C.SELECT_COLOR, Constants_1.C.SELECT_SAT, Constants_1.C.SELECT_LIGHTNESS], { placeHolder: 'Foreground Color Editor', });
            if (selection === Constants_1.C.ENTER_COLOR) {
                yield handlersPrompts_1.Prompts.enterForegroundColorHandler();
            }
            else {
                if (selection === Constants_1.C.SELECT_COLOR) {
                    yield handlersPickers_1.Pickers.foregroundColorPickerHueHandler();
                }
                else if (selection === Constants_1.C.SELECT_SAT) {
                    yield handlersPickers_1.Pickers.foregroundColorPickerSaturationHandler();
                }
                else if (selection === Constants_1.C.SELECT_LIGHTNESS) {
                    yield handlersPickers_1.Pickers.foregroundColorPickerLightnessHandler();
                }
            }
        });
    }
}
exports.Editors = Editors;
//# sourceMappingURL=handlersEditors.js.map