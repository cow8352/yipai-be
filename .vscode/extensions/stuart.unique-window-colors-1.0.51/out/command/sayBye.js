"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
const vscode = require("vscode");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
function sayByeCommand() {
    const message = localize('sayBye.text', 'Bye');
    vscode.window.showInformationMessage(message);
}
exports.sayByeCommand = sayByeCommand;
//# sourceMappingURL=sayBye.js.map