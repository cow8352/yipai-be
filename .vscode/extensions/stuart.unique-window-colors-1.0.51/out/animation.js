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
const tinygradient = require("tinygradient");
const vscode = require("vscode");
const Constants_1 = require("./Constants");
const tools_1 = require("./tools");
class A {
}
A.doAnimate = false;
exports.A = A;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function saveGradientInputColors(colors) {
    return __awaiter(this, void 0, void 0, function* () {
        let recentGradientColors = yield tools_1.Tools.getSetting(Constants_1.C.RecentGradientColors);
        if (recentGradientColors) {
            if (!(colors in recentGradientColors)) {
                recentGradientColors = [colors, ...recentGradientColors];
            }
        }
        else {
            recentGradientColors = [colors];
        }
        yield tools_1.Tools.setGlobalSetting(Constants_1.C.RecentGradientColors, recentGradientColors);
    });
}
function generateGradient(gradientInput) {
    // const STEPS_PER_TRANSITION = 500;
    const STEPS_PER_TRANSITION = tools_1.Tools.getSetting(Constants_1.C.animationStepsPerTransition);
    //TODO - 500 steps per color pair?
    const gradientInputArray = gradientInput.split(' ');
    const first = gradientInputArray[0];
    const last = gradientInputArray[gradientInputArray.length - 1];
    if (first !== last) {
        gradientInputArray.push(first); //so each transition is smooth
    }
    const numTransitions = gradientInputArray.length - 1;
    const numSteps = numTransitions * STEPS_PER_TRANSITION;
    const gradient = tinygradient(gradientInputArray);
    const gradientOutputArray = gradient.rgb(numSteps).map((x) => x.toHexString());
    return gradientOutputArray;
}
exports.generateGradient = generateGradient;
function animate(gradientInputStr) {
    return __awaiter(this, void 0, void 0, function* () {
        A.doAnimate = true;
        const MILLISECONDS_PER_STEP = tools_1.Tools.getSetting(Constants_1.C.animationMillisecondsPerStep);
        const gradientInputArray = gradientInputStr.split(' ');
        for (let i = 0; i < gradientInputArray.length; i++) {
            const colorSt = gradientInputArray[i];
            if (!tools_1.Tools.isValidColor(colorSt)) {
                vscode.window.showErrorMessage('"' + colorSt + '" is not a valid color.');
                return;
            }
        }
        const gradient = generateGradient(gradientInputStr);
        while (A.doAnimate) {
            for (let i = 0; i < gradient.length; i++) {
                yield sleep(MILLISECONDS_PER_STEP);
                let s = tools_1.Tools.getInternalSettingsObject();
                let c = tools_1.Tools.getExtensionSettings();
                if (A.doAnimate && s[Constants_1.C.animationDoAnimate] && s[Constants_1.C.animationGradientInputStr] === gradientInputStr) {
                    let cc = tools_1.Tools.getColorCustomizations();
                    let gradientColor = Color(gradient[i]);
                    if (c[Constants_1.C.ModifyTitleBar]) {
                        let color = tools_1.Tools.slightlyLighter(gradientColor);
                        cc[Constants_1.C.titleBar_activeBackground] = color.hex();
                        // cc[C.titleBar_activeBackground] = Color(gradient[i]).lighten(0.1).hex();
                        cc[Constants_1.C.titleBar_inactiveBackground] = gradient[i];
                    }
                    if (c[Constants_1.C.ModifyActivityBar]) {
                        cc[Constants_1.C.activityBar_background] = gradient[i];
                    }
                    if (c[Constants_1.C.ModifyStatusBar]) {
                        let color = tools_1.Tools.slightlyDarker(gradientColor);
                        cc[Constants_1.C.statusBar_background] = color.hex();
                    }
                    yield tools_1.Tools.setColorCustomizations(cc);
                }
                else {
                    break;
                }
            }
        }
    });
}
exports.animate = animate;
function animateHandler() {
    return __awaiter(this, void 0, void 0, function* () {
        //Options:
        const ENTER_COLORS = 'Enter gradient colors';
        const RECENT = 'Recent';
        const STOP = 'Stop animation';
        let selection = yield vscode.window.showQuickPick([ENTER_COLORS, RECENT, STOP], { placeHolder: 'Animation menu' });
        if (selection === undefined) {
            return;
        }
        /** list of color names separated by space, used to generate actual gradient */
        let gradientInputStr;
        switch (selection) {
            case ENTER_COLORS:
                const options = {
                    placeHolder: '(eg "peachpuff #ff00ff BlanchedAlmond teal")',
                    prompt: 'Enter up to 5 colors separated by spaces'
                };
                gradientInputStr = yield vscode.window.showInputBox(options);
                if (gradientInputStr === undefined) {
                    return;
                }
                gradientInputStr = tools_1.Tools.trim(gradientInputStr);
                yield saveGradientInputColors(gradientInputStr);
                A.doAnimate = true;
                break;
            case RECENT:
                gradientInputStr = (yield vscode.window.showQuickPick(tools_1.Tools.getSetting(Constants_1.C.RecentGradientColors) || ['(no recent gradients)'], { placeHolder: 'Recent gradient colors:' }));
                if (gradientInputStr === undefined) {
                    return;
                }
                if (A.doAnimate) {
                    A.doAnimate = false;
                    yield tools_1.Tools.setInternalSettings({
                        [Constants_1.C.animationDoAnimate]: false,
                        [Constants_1.C.animationGradientInputStr]: undefined,
                        [Constants_1.C.portfolioAndColor]: undefined,
                        [Constants_1.C.useAutomatic]: undefined
                    });
                }
                A.doAnimate = true;
                break;
            case STOP:
                A.doAnimate = false;
                break;
        }
        if (gradientInputStr === '(no recent gradients)') {
            return;
        }
        if (A.doAnimate) {
            yield tools_1.Tools.setInternalSettings({
                [Constants_1.C.animationDoAnimate]: true,
                [Constants_1.C.animationGradientInputStr]: gradientInputStr,
                [Constants_1.C.portfolioAndColor]: undefined,
                [Constants_1.C.useAutomatic]: undefined
            });
            yield animate(gradientInputStr);
        }
        else {
            yield tools_1.Tools.setInternalSettings({
                [Constants_1.C.animationDoAnimate]: false,
                [Constants_1.C.animationGradientInputStr]: '' //why not undefined?
            });
        }
    });
}
exports.animateHandler = animateHandler;
//# sourceMappingURL=animation.js.map