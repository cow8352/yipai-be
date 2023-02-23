"use strict";
// import * as fs from 'fs';
// import { workspace } from 'vscode';
// import { IColors } from './IColors';
// export class SettingsFileDeleterOld {
//   constructor(
//     private workspaceRoot: string,
//     private colors: IColors) { }
//   /** 
//    * Deletes .vscode/settings.json if colors all match either the default light or dark Windows Colors and if no other settings exist.
//    * 
//    * Deletes .vscode if no other files exist.
//    */
//   public dispose() {
//     const settingsfile = this.workspaceRoot + '/.vscode/settings.json';
//     const vscodeSettingsDir = this.workspaceRoot + '/.vscode';
//     const settingsFileJson = JSON.parse((fs.readFileSync(settingsfile, "utf8")));
//     const cc = JSON.parse(JSON.stringify(workspace.getConfiguration('workbench').get('colorCustomizations')));
//     const deleteSettingsFileUponExit = JSON.parse(JSON.stringify(
//       workspace.getConfiguration('windowColors').get<string>(' DeleteSettingsFileUponExit')
//     ));
//     if (deleteSettingsFileUponExit) {
//       fs.unlinkSync(settingsfile);
//       fs.rmdirSync(vscodeSettingsDir);  //only deletes empty folders
//     }
//     else if (Object.keys(settingsFileJson).length === 1 && Object.keys(cc).length === 3) {
//       const aColorWasModified =
//         (cc['activityBar.background'] !== this.colors.activityBarColor_dark.hex() && cc['activityBar.background'] !== this.colors.activityBarColor_light.hex()) ||
//         (cc['titleBar.activeBackground'] !== this.colors.titleBarColor_dark.hex() && cc['titleBar.activeBackground'] !== this.colors.titleBarColor_light.hex()) ||
//         (cc['titleBar.activeForeground'] !== this.colors.titleBarTextColor_dark.hex() && cc['titleBar.activeForeground'] !== this.colors.titleBarTextColor_light.hex());
//       if (!aColorWasModified) {
//         fs.unlinkSync(settingsfile);
//         fs.rmdirSync(vscodeSettingsDir);  //only deletes empty folders
//       }
//     }
//   }
// }
//# sourceMappingURL=SettingsFileDeleterOld.js.map