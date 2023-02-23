"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./tools");
class SettingsFileDeleter {
    /**
     * Deletes .vscode/settings.json if colors all the settings are WC stuff or colorCustomizations or theme
     *
     * Deletes .vscode if no other files exist.
     */
    dispose() {
        const doDeleteLocalSettingsOnClose = true; //Tools.getSetting(C.DeleteLocalSettingsOnClose)
        if (doDeleteLocalSettingsOnClose) {
            tools_1.Tools.deleteSettingsFileAndParentIfEmpty(tools_1.Tools.getWorkspaceRoot());
        }
    }
}
exports.SettingsFileDeleter = SettingsFileDeleter;
//# sourceMappingURL=SettingsFileDeleter.js.map