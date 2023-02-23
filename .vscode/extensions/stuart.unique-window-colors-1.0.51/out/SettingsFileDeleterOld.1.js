"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const vscode_1 = require("vscode");
class SettingsFileDeleter {
    constructor(workspaceRoot, colors) {
        this.workspaceRoot = workspaceRoot;
        this.colors = colors;
    }
    /**
     * Deletes .vscode/settings.json if colors all match either the default light or dark Windows Colors and if no other settings exist.
     *
     * Deletes .vscode if no other files exist.
     */
    dispose() {
        const settingsfile = this.workspaceRoot + '/.vscode/settings.json';
        const vscodeSettingsDir = this.workspaceRoot + '/.vscode';
        const settingsFileJson = JSON.parse((fs.readFileSync(settingsfile, "utf8")));
        const cc = JSON.parse(JSON.stringify(vscode_1.workspace.getConfiguration('workbench').get('colorCustomizations')));
        const deleteSettingsFileUponExit = JSON.parse(JSON.stringify(vscode_1.workspace.getConfiguration('windowColors').get(' DeleteSettingsFileUponExit')));
        if (deleteSettingsFileUponExit) {
            fs.unlinkSync(settingsfile);
            fs.rmdirSync(vscodeSettingsDir); //only deletes empty folders
        }
        else if (Object.keys(settingsFileJson).length === 1 && Object.keys(cc).length === 3) {
            const aColorWasModified = (cc['activityBar.background'] !== this.colors.activityBarColor_dark.hex() && cc['activityBar.background'] !== this.colors.activityBarColor_light.hex()) ||
                (cc['titleBar.activeBackground'] !== this.colors.titleBarColor_dark.hex() && cc['titleBar.activeBackground'] !== this.colors.titleBarColor_light.hex()) ||
                (cc['titleBar.activeForeground'] !== this.colors.titleBarTextColor_dark.hex() && cc['titleBar.activeForeground'] !== this.colors.titleBarTextColor_light.hex());
            if (!aColorWasModified) {
                fs.unlinkSync(settingsfile);
                fs.rmdirSync(vscodeSettingsDir); //only deletes empty folders
            }
        }
    }
}
exports.SettingsFileDeleter = SettingsFileDeleter;
//# sourceMappingURL=SettingsFileDeleterOld.1.js.map