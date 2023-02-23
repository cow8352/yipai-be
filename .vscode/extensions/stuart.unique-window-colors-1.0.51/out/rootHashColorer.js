"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Color = require("color");
const vscode_1 = require("vscode");
const SettingsFileDeleterOld_1 = require("./SettingsFileDeleterOld");
const tools_1 = require("./tools");
const colorManip_1 = require("./colorManip");
const Constants_1 = require("./Constants");
exports.getRootHashColor = () => {
    if (!vscode_1.workspace.workspaceFolders) {
        return undefined;
    }
    const workspaceRoot = tools_1.Tools.getWorkspaceRoot();
    return Color('#' + stringToARGB(workspaceRoot));
    ;
};
function getAutomaticColor() {
    const rootHashColor = exports.getRootHashColor();
    return tools_1.Tools.getTheme().toLowerCase().includes('light') ?
        colorManip_1.ColorManip.getLight(rootHashColor) :
        colorManip_1.ColorManip.getDark(rootHashColor);
}
exports.getAutomaticColor = getAutomaticColor;
function setRootHashColors(context) {
    if (!vscode_1.workspace.workspaceFolders) {
        return '';
    }
    const workspaceRoot = tools_1.Tools.getWorkspaceRoot();
    // const extensionTheme = workspace.getConfiguration('windowColors').get<string>('Theme');
    const extensionTheme = tools_1.Tools.getInternalSetting('Theme');
    let baseColor = tools_1.Tools.getInternalSetting(Constants_1.C.BaseColor);
    // let baseColor = workspace.getConfiguration('windowColors').get<string>('BaseColor');
    if (baseColor) {
        baseColor = baseColor.toLowerCase().trim();
    }
    /** retain initial unrelated colorCustomizations*/
    // const cc = JSON.parse(JSON.stringify(workspace.getConfiguration('workbench').get('colorCustomizations')));
    const cc = tools_1.Tools.getColorCustomizations();
    let activityBarColor = exports.getRootHashColor();
    let titleBarTextColor = Color('#ffffff');
    let titleBarColor = Color('#ffffff');
    const activityBarColor_dark = colorManip_1.ColorManip.getColorWithLuminosity(activityBarColor, .02, .027);
    const titleBarTextColor_dark = colorManip_1.ColorManip.getColorWithLuminosity(activityBarColor_dark, 0.95, 1);
    const titleBarColor_dark = activityBarColor_dark.lighten(0.4);
    const activityBarColor_light = colorManip_1.ColorManip.getColorWithLuminosity(activityBarColor, 0.45, 0.55);
    const titleBarTextColor_light = colorManip_1.ColorManip.getColorWithLuminosity(activityBarColor_light, 0, 0.01);
    const titleBarColor_light = activityBarColor_light.lighten(0.1);
    if (extensionTheme === 'dark') {
        activityBarColor = activityBarColor_dark;
        titleBarTextColor = titleBarTextColor_dark;
        titleBarColor = titleBarColor_dark;
    }
    else if (extensionTheme === 'light') {
        activityBarColor = activityBarColor_light;
        titleBarTextColor = titleBarTextColor_light;
        titleBarColor = titleBarColor_light;
    }
    if (baseColor) {
        activityBarColor = Color(baseColor);
        titleBarColor = activityBarColor.lighten(0.3);
        titleBarTextColor = colorManip_1.ColorManip.getHighContrast(titleBarColor);
        // if (titleBarColor.luminosity() > 0.5) { //a light color https://www.npmjs.com/package/color#luminosity
        //   titleBarTextColor = ColorTools.getColorWithLuminosity(activityBarColor, 0, 0.01);
        // }
        // else {
        //   titleBarTextColor = ColorTools.getColorWithLuminosity(activityBarColor, 0.95, 1);
        // }
    }
    const doRemoveColors = extensionTheme === 'remove';
    let doUpdateColors = true;
    if (cc && (cc['activityBar.background'] || cc['titleBar.activeBackground'] || cc['titleBar.activeForeground'])) {
        //don't overwrite
        doUpdateColors = false;
    }
    if (baseColor) {
        doUpdateColors = true;
    }
    if (doUpdateColors || doRemoveColors) {
        const newColors = {
            "activityBar.background": doRemoveColors ? undefined : activityBarColor.hex(),
            "titleBar.activeBackground": doRemoveColors ? undefined : titleBarColor.hex(),
            "titleBar.activeForeground": doRemoveColors ? undefined : titleBarTextColor.hex(),
        };
        vscode_1.workspace.getConfiguration('workbench').update('colorCustomizations', Object.assign({}, cc, newColors), false);
    }
    const settingsFileDeleter = new SettingsFileDeleterOld_1.SettingsFileDeleterOld(workspaceRoot, { activityBarColor_dark, titleBarTextColor_dark, titleBarColor_dark, activityBarColor_light, titleBarTextColor_light, titleBarColor_light });
    context.subscriptions.push(settingsFileDeleter);
    return activityBarColor.hex() + '';
}
exports.setRootHashColors = setRootHashColors;
function stringToARGB(str) {
    return intToARGB(hashCode(str));
}
// https://www.designedbyaturtle.co.uk/convert-string-to-hexidecimal-colour-with-javascript-vanilla/
// Hash any string into an integer value
// Then we'll use the int and convert to hex.
function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}
// https://www.designedbyaturtle.co.uk/convert-string-to-hexidecimal-colour-with-javascript-vanilla/
// Convert an int to hexadecimal with a max length
// of six characters.
function intToARGB(i) {
    var hex = ((i >> 24) & 0xFF).toString(16) +
        ((i >> 16) & 0xFF).toString(16) +
        ((i >> 8) & 0xFF).toString(16) +
        (i & 0xFF).toString(16);
    // Sometimes the string returned will be too short so we 
    // add zeros to pad it out, which later get removed if
    // the length is greater than six.
    hex += '000000';
    return hex.substring(0, 6);
}
//# sourceMappingURL=rootHashColorer.js.map