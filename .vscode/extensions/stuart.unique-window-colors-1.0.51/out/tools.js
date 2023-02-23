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
const Color = require("Color");
const fs = require("fs");
const path = require("path");
const platform_folders_1 = require("platform-folders");
const vscode = require("vscode");
const vscode_1 = require("vscode");
const animation_1 = require("./animation");
const colorManip_1 = require("./colorManip");
const Constants_1 = require("./Constants");
const messages_1 = require("./messages");
const library_1 = require("./library");
const portfoliosPresets_1 = require("./portfoliosPresets");
function getValues(obj) {
    let ar = [];
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var val = obj[key];
            ar.push(val);
        }
    }
    return ar;
}
class Tools {
    static attemptToSetBackgroundBaseColor(inputColor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Tools.isValidColor(inputColor)) {
                vscode.window.showErrorMessage(`"${inputColor}" is not a valid color.`);
            }
            else {
                yield Tools.setInternalSettings({
                    [Constants_1.C.BackgroundLightness]: Constants_1.C.defaultLightness,
                    [Constants_1.C.BackgroundSaturation]: Constants_1.C.defaultSaturation,
                    [Constants_1.C.BaseColor]: Color(inputColor).hex(),
                    [Constants_1.C.portfolioAndColor]: undefined,
                    [Constants_1.C.useAutomatic]: undefined,
                    [Constants_1.C.animationDoAnimate]: false
                });
            }
        });
    }
    static installAutomaticColor_ifRequested(myGlobalData) {
        return __awaiter(this, void 0, void 0, function* () {
            const root = Tools.getWorkspaceRoot();
            let globalDataObj = myGlobalData[root];
            // if overwriteAllWorkspaceColorsWithAutomaticPortfolio === true AND portfolioAndColor's portfolio is different from windowColors.AutomaticColorsPortfolio, then install an automatic color. 
            const c = Tools.getExtensionSettings();
            try {
                const doOverwrite = c[Constants_1.C.overwriteAllWorkspaceColorsWithAutomaticPortfolio];
                const AutomaticColorsPortfolio = c[Constants_1.C.AutomaticColorsPortfolio];
                const internalSettings = globalDataObj[Constants_1.C.internalSettings];
                const portfolioAndColor = internalSettings[Constants_1.C.portfolioAndColor];
                const currPortfolio = portfolioAndColor[Constants_1.C.portfolio];
                if (doOverwrite && (AutomaticColorsPortfolio !== currPortfolio)) {
                    yield Tools.installAutomaticColoration();
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                return false;
            }
        });
    }
    static trim(str) {
        return str.trim().replace(/\s\s+/g, ' ');
    }
    static installAutomaticColoration() {
        return __awaiter(this, void 0, void 0, function* () {
            let portfolio = Tools.getSetting(Constants_1.C.AutomaticColorsPortfolio);
            if (portfolio === undefined) {
                messages_1.Errors.automaticPortfolioNotSet();
                return;
            }
            if (portfolio === Constants_1.C.Automatic) {
                const theme = Tools.getTheme();
                if (theme.toLowerCase().includes('light')) {
                    portfolio = 'Light';
                }
                else {
                    portfolio = 'Dusty';
                }
            }
            // "internalSettings": {
            //   "BaseColor": "hsl(285,100%,         16%)",
            //   "portfolioAndColor": {
            //     "portfolio": "Very Dark",
            //     "coloration": "hsl(285,100%,16%)"
            const shuffledPortfolioColorations = shuffle(library_1.Library.getColorationNamesInPortfolio(portfolio));
            if (shuffledPortfolioColorations.length < 2) {
                messages_1.Errors.notEnoughPortfolioColors(portfolio, shuffledPortfolioColorations);
                return;
            }
            const usedColorationsCounts = Tools.getCurrentlyUsedColorationsCountsInPortfolio(portfolio);
            // console.log('usedColorationsCounts', JSON.stringify(usedColorationsCounts));
            const minCount = Math.min(...getValues(usedColorationsCounts));
            // console.log('minCount', JSON.stringify(minCount));
            // console.log('maxCount', JSON.stringify(Math.max(...getValues(usedColorationsCounts))));
            let coloration;
            for (let i = 0; i < shuffledPortfolioColorations.length; i++) {
                coloration = shuffledPortfolioColorations[i];
                if (usedColorationsCounts[coloration] === minCount) {
                    break;
                }
            }
            // console.log('coloration', coloration);
            //ok we have the coloration to use.  now load it.
            yield library_1.Library.loadColoration(portfolio, coloration, true);
        });
    }
    static installPortfolioPresets_ifMissing() {
        return __awaiter(this, void 0, void 0, function* () {
            const presets = portfoliosPresets_1.default;
            const portfolioNames = Object.keys(presets);
            let myGlobalData = Tools.getSetting(Constants_1.C.myGlobalData);
            if (myGlobalData === undefined) {
                myGlobalData = {};
            }
            if (myGlobalData[Constants_1.C.portfolios] === undefined) {
                myGlobalData[Constants_1.C.portfolios] = {};
            }
            let portfoliosToAdd = {};
            portfolioNames.forEach(p => {
                if (!(p in myGlobalData[Constants_1.C.portfolios])) {
                    portfoliosToAdd[p] = presets[p];
                }
            });
            if (JSON.stringify(portfoliosToAdd) !== "{}") {
                myGlobalData[Constants_1.C.portfolios] = Object.assign({}, myGlobalData[Constants_1.C.portfolios], portfoliosToAdd);
                yield Tools.setGlobalSetting(Constants_1.C.myGlobalData, myGlobalData);
            }
            return myGlobalData;
        });
    }
    static getRandomElement(ar) {
        const i = Math.floor(Math.random() * ar.length);
        return ar[i];
    }
    /** return map.  key: coloration. value: num occurrences */
    static getCurrentlyUsedColorationsCountsInPortfolio(portfolio) {
        // "internalSettings": {
        //   "BaseColor": "hsl(285,100%,         16%)",
        //   "portfolioAndColor": {
        //     "portfolio": "Very Dark",
        //     "coloration": "hsl(285,100%,16%)"
        const myGlobalData = Tools.getSetting(Constants_1.C.myGlobalData);
        const colorations = library_1.Library.getColorationNamesInPortfolio(portfolio);
        const colorationsCounts = {};
        colorations.forEach(c => { colorationsCounts[c] = 0; });
        for (let key in myGlobalData) {
            let obj = myGlobalData[key];
            // // const obj = myGlobalData[key] as any;
            // console.log('key', key)
            // console.log('obj', JSON.stringify(obj))
            if (obj && obj[Constants_1.C.internalSettings] &&
                obj[Constants_1.C.internalSettings][Constants_1.C.portfolioAndColor] &&
                obj[Constants_1.C.internalSettings][Constants_1.C.portfolioAndColor][Constants_1.C.portfolio] === portfolio) {
                const coloration = obj[Constants_1.C.internalSettings][Constants_1.C.portfolioAndColor][Constants_1.C.coloration];
                colorationsCounts[coloration] += 1; //works
            }
        }
        return colorationsCounts;
    }
    static checkElement(initSelected, ar) {
        if (initSelected) {
            for (let i = 0; i < ar.length; i++) {
                if (ar[i] === initSelected) {
                    ar[i] += '  ✅';
                    return ar;
                }
            }
        }
        return ar;
    }
    static isValidColor(cololStr) {
        try {
            Color(cololStr); //to check if valid color name or not
        }
        catch (error) {
            return false;
        }
        return true;
        ;
    }
    static colorationIsTriggered(prevConfig, currConfig) {
        if (!prevConfig) {
            return true;
        }
        const prevTrigStr = JSON.stringify(this.getColorationRelevantObjFromWorkspaceSettings(prevConfig));
        const currTrigStr = JSON.stringify(this.getColorationRelevantObjFromWorkspaceSettings(currConfig));
        return prevTrigStr !== currTrigStr;
    }
    /** also look directly in internalSettings */
    static getColorationRelevantObjFromWorkspaceSettings(c) {
        let internalSettings = c[Constants_1.C.internalSettings];
        let obj1 = Tools.getELementsInNewJson(c, Constants_1.C.colorationTriggers);
        let obj2 = Tools.getELementsInNewJson(internalSettings, Constants_1.C.colorationTriggers);
        return Object.assign({}, obj1, obj2);
    }
    /** internal settings object merged with Modify...Bar settings */
    static getLifecycleTriggerJson() {
        let result = Tools.getInternalSettingsObject();
        let c = Tools.getExtensionSettings();
        result[Constants_1.C.ModifyTitleBar] = c[Constants_1.C.ModifyTitleBar];
        result[Constants_1.C.ModifyActivityBar] = c[Constants_1.C.ModifyActivityBar];
        result[Constants_1.C.ModifyStatusBar] = c[Constants_1.C.ModifyStatusBar];
        return c; //was results
    }
    static getELementsInNewJson(obj, keys) {
        let out = {};
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            out[key] = obj[key];
        }
        return obj;
    }
    static getExtensionSettings() {
        let config = Tools.getConfig();
        let obj = {};
        for (let i = 0; i < Constants_1.C.extensionSettings.length; i++) {
            let settingName = Constants_1.C.extensionSettings[i];
            obj[settingName] = config.get(settingName);
        }
        return obj;
    }
    /**TODO - open vscode bug - when a value is changed to '#000000' - then vscode.ConfigurationChangeEvent doesn't trigger */
    static deblack(x) {
        if (x === undefined) {
            return x;
        }
        if (typeof x === 'string') {
            x = x.replace(/#000000/g, '#010101');
        }
        if (typeof x === 'object') {
            if (x[Constants_1.C.BaseColor] === 'black') {
                x[Constants_1.C.BaseColor] = '#010101';
            }
        }
        return x;
    }
    static getColorCustomizations() {
        return JSON.parse(JSON.stringify(vscode_1.workspace.getConfiguration('workbench').get('colorCustomizations')));
    }
    static setColorCustomizations(cc) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.workspace.getConfiguration('workbench').update('colorCustomizations', cc, false);
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////// custom theme ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /** also sets color in cc.  bad idea? side effect? */
    static setCustomThemeItem(themeItem, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let customThemeMap = Tools.getInternalSetting(Constants_1.C.customThemeMap) || {};
            customThemeMap[themeItem] = obj;
            yield Tools.setInternalSettings({
                [Constants_1.C.customThemeMap]: customThemeMap,
                [Constants_1.C.portfolioAndColor]: undefined,
                [Constants_1.C.useAutomatic]: undefined
            });
        });
    }
    static getCustomThemeItemSaturationFromMap(customThemeMap, item) {
        let themeObject = customThemeMap[item];
        if (themeObject) {
            if (Constants_1.C.customThemeSaturation in themeObject) {
                return themeObject[Constants_1.C.customThemeSaturation];
            }
        }
        return Constants_1.C.defaultSaturation;
    }
    static getCustomThemeItemLightnessFromMap(customThemeMap, item) {
        let themeObject = customThemeMap[item];
        if (themeObject) {
            if (Constants_1.C.customThemeLightness in themeObject) {
                return themeObject[Constants_1.C.customThemeLightness];
            }
        }
        return Constants_1.C.defaultLightness;
    }
    static removeCustomThemeItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            let customThemeMap = Tools.getInternalSetting(Constants_1.C.customThemeMap);
            delete customThemeMap[item];
            yield Tools.setInternalSetting(Constants_1.C.customThemeMap, customThemeMap);
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // end custom theme ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static getTheme() {
        try {
            let json = Tools.getLocalSettingsJsonFromDisk();
            if ("workbench.colorTheme" in json) {
                // console.log('theme from local settings: ' + json["workbench.colorTheme"]);
                return json["workbench.colorTheme"];
            }
            //now look in global settings file
            json = Tools.getGlobalSettingsJsonFromDisk();
            if ("workbench.colorTheme" in json) {
                return json["workbench.colorTheme"];
            }
        }
        catch (error) {
            //do nothing
            console.log('caught an error: getTheme: ' + error);
        }
        return "Default Dark+";
    }
    static setTheme(themeName) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = Tools.getLocalSettingsJsonFromDisk();
            if (json['folders'] && json['settings']) {
                json['settings']["workbench.colorTheme"] = themeName;
            }
            else {
                json["workbench.colorTheme"] = themeName;
            }
            //check if no settings file exists. if so, save an empty cc
            const settingsFilePath = Tools.getLocalSettingsPath();
            if (settingsFilePath === undefined || !fs.existsSync(settingsFilePath)) {
                yield Tools.setColorCustomizations(JSON.parse('{}'));
            }
            Tools.writeLocalSettingsJsonToDisk(json);
            // vscode.window.showInformationMessage('before save settings')
            yield Tools.saveSettings();
            // vscode.window.showInformationMessage('after save settings')
        });
    }
    static writeLocalSettingsJsonToDisk(json) {
        fs.writeFileSync(Tools.getLocalSettingsPath(), JSON.stringify(json, null, 4));
    }
    static showInformationMessage(message) {
        vscode.window.showInformationMessage(message);
    }
    static getConfig() {
        return vscode_1.workspace.getConfiguration('windowColors');
    }
    static getSetting(name) {
        return JSON.parse(JSON.stringify(vscode_1.workspace.getConfiguration('windowColors').get(name)));
    }
    static setSetting(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            value = Tools.deblack(value);
            yield vscode_1.workspace.getConfiguration('windowColors').update(name, value);
        });
    }
    /** stuff we don't want user to be able to access. */
    static getInternalSettingsObject() {
        return Tools.getSetting(Constants_1.C.internalSettings);
    }
    /** stuff we don't want user to be able to access. */
    static getInternalSetting(name) {
        let s = Tools.getSetting(Constants_1.C.internalSettings);
        return s === undefined ? undefined : s[name];
    }
    /** stuff we don't want user to be able to access. */
    static setInternalSetting(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            value = Tools.deblack(value);
            let obj = Tools.getSetting(Constants_1.C.internalSettings);
            obj[name] = value;
            return yield Tools.setSetting(Constants_1.C.internalSettings, obj);
        });
    }
    /** stuff we don't want user to be able to access. */
    static setInternalSettings(inputObj) {
        return __awaiter(this, void 0, void 0, function* () {
            for (var key in inputObj) {
                if (inputObj.hasOwnProperty(key)) {
                    inputObj[key] = Tools.deblack(inputObj[key]);
                }
            }
            let obj = Tools.getSetting(Constants_1.C.internalSettings) || {};
            const newInternalSettingsToSet = Object.assign({}, obj, inputObj);
            yield Tools.setSetting(Constants_1.C.internalSettings, newInternalSettingsToSet);
        });
    }
    static setGlobalSetting(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('setGlobalSetting ' + name + ', value: ');
            // console.log(value);
            let config = vscode.workspace.getConfiguration();
            return yield config.update('windowColors.' + name, value, vscode.ConfigurationTarget.Global);
        });
    }
    static getWorkspaceRoot() {
        return getWorkspaceFolder(vscode_1.workspace.workspaceFolders);
    }
    static getLocalDotVscodeDirPath() {
        return path.resolve(this.getWorkspaceRoot(), '.vscode');
    }
    static getLocalDotVscodeDirPathForWorkspace(root) {
        return path.resolve(root, '.vscode');
    }
    //cd "/Users/stuartrobinson/Library/Application Support/Code/Workspaces/1556590758890"^
    //TODO - move this out - just search once for global workspace dir
    static getLocalSettingsPath() {
        const root = Tools.getWorkspaceRoot();
        return Tools.getLocalSettingsPathForWorkspace(root);
    }
    static getLocalSettingsPathForWorkspace(root) {
        const localDirPotentialLocation = path.resolve(Tools.getLocalDotVscodeDirPathForWorkspace(root), 'settings.json');
        if (fs.existsSync(localDirPotentialLocation)) {
            return localDirPotentialLocation;
        }
        const workspacesDir = path.resolve(platform_folders_1.default('appData'), 'Code', 'Workspaces');
        const workspaceDirs = fs.readdirSync(workspacesDir);
        for (let i = 0; i < workspaceDirs.length; i++) {
            const workspaceDir = workspaceDirs[i];
            let settingsFilePath = path.resolve(platform_folders_1.default('appData'), 'Code', 'Workspaces', workspaceDir, 'workspace.json');
            let settingsStr = fs.readFileSync(settingsFilePath).toString();
            let settingsJson = JSON.parse(settingsStr);
            if (settingsJson['folders'] === undefined) {
                return undefined;
            }
            let theListedRootPath = settingsJson['folders'][0]['path'];
            if (theListedRootPath === root) {
                return settingsFilePath;
            }
        }
        // throw Error('settings file not found!!!! D:');
        return undefined;
    }
    static getGlobalSettingsPath() {
        const result = path.resolve(platform_folders_1.default('appData'), 'Code', 'User', 'settings.json');
        // console.log('getGlobalSettingsPath: ' + result);
        return result;
    }
    static getLocalSettingsJsonFromDisk() {
        const root = Tools.getWorkspaceRoot();
        return Tools.getLocalSettingsJsonFromDiskForWorkspace(root);
    }
    static getLocalSettingsJsonFromDiskForWorkspace(root) {
        let settingsContentsStr = 'init';
        try {
            const settingsPath = Tools.getLocalSettingsPathForWorkspace(root);
            if (settingsPath === undefined) {
                return {};
            }
            settingsContentsStr = fs.readFileSync(settingsPath).toString();
            settingsContentsStr = settingsContentsStr.replace(/\n/g, " ");
            settingsContentsStr = settingsContentsStr.replace(/ +/g, " ");
            settingsContentsStr = settingsContentsStr.replace(/, }/g, "}");
            settingsContentsStr = settingsContentsStr.replace(/,}/g, "}");
            return JSON.parse(settingsContentsStr);
        }
        catch (error) {
            console.log('settingsContentsStr,', settingsContentsStr);
            console.log('caught an error: getLocalSettingsJsonFromDiskForWorkspace: ' + error);
            return {};
        }
    }
    static getGlobalSettingsJsonFromDisk() {
        try {
            let settingsContentsStr = fs.readFileSync(Tools.getGlobalSettingsPath()).toString();
            settingsContentsStr = settingsContentsStr.replace(/\n/g, " ");
            settingsContentsStr = settingsContentsStr.replace(/ +/g, " ");
            settingsContentsStr = settingsContentsStr.replace(/, }/g, "}");
            settingsContentsStr = settingsContentsStr.replace(/,}/g, "}");
            return JSON.parse(settingsContentsStr);
        }
        catch (error) {
            console.log('caught an error:  getGlobalSettingsJsonFromDisk: ' + error);
            return {};
        }
    }
    static deleteLocalSettingsFileIfSafeToDo() {
        let json = Tools.getLocalSettingsJsonFromDisk();
        for (var prop in json) {
            if (json.hasOwnProperty(prop)) {
                // do stuff
                if (!(prop === "workbench.colorCustomizations" || prop === "workbench.colorTheme" || prop.includes("windowColors"))) {
                    return false;
                }
            }
        }
        const settingsPath = Tools.getLocalSettingsPath();
        if (settingsPath && fs.existsSync(settingsPath)) {
            fs.unlinkSync(settingsPath);
        }
        if (fs.readdirSync(Tools.getLocalDotVscodeDirPath()).length === 0) {
            fs.rmdirSync(Tools.getLocalDotVscodeDirPath());
        }
        return true;
    }
    static removeWorkspaceFromGlobalData() {
        return __awaiter(this, void 0, void 0, function* () {
            const root = Tools.getWorkspaceRoot();
            let data = Tools.getSetting(Constants_1.C.myGlobalData);
            delete data[root];
            yield Tools.setGlobalSetting(Constants_1.C.myGlobalData, data);
        });
    }
    static removeAllWorkspacesFromGlobalData() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = Tools.getSetting(Constants_1.C.myGlobalData);
            for (var key in data) {
                if (data.hasOwnProperty(key) && key != Constants_1.C.portfolios) {
                    delete data[key];
                }
            }
            yield Tools.setGlobalSetting(Constants_1.C.myGlobalData, data);
        });
    }
    static removeModificationsToLocalSettingsFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const actualTheme = Tools.getTheme();
            const internalSettingsTheme = Tools.getInternalSetting(Constants_1.C.theme);
            // console.log('actualTheme')
            // console.log(actualTheme)
            // console.log("internalSettingsTheme")
            // console.log(internalSettingsTheme)
            yield Tools.setSetting(Constants_1.C.internalSettings, undefined); //TODO open vscode bug, it fails when using undefined to remove setting (no error thrown)
            yield Tools.setColorCustomizations({});
            yield Tools.setSetting(Constants_1.C.ModifyTitleBar, undefined);
            yield Tools.setSetting(Constants_1.C.ModifyActivityBar, undefined);
            yield Tools.setSetting(Constants_1.C.ModifyStatusBar, undefined);
            // remove theme if vscode workspace theme equals windowcolors internalsettings theme
            //has to go at the end here.  otherwise get weird file errors from messing w/ actual disk maybe?
            if (actualTheme === internalSettingsTheme) {
                yield Tools.setTheme(undefined);
            }
        });
    }
    /** don't delete settings.json cos that screws stuff up. */
    static clearWorkspaceSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Tools.removeModificationsToLocalSettingsFile();
            yield Tools.removeWorkspaceFromGlobalData();
        });
    }
    static clearExternalWorkspaceSettings(root) {
        //   {
        //     "folders": [
        //         {
        //             "path": "/Users/stuartrobinson/repos/vscodeplugtest/windowcolorsapril2019/unique-window-colors/img"
        //         }
        //     ],
        //     "settings": {
        //         "windowColors.internalSettings": {
        //             "BaseColor": "hsl(100,100%,               8%)",
        //             "portfolioAndColor": {
        //                 "portfolio": "Very Dark",
        //                 "coloration": "hsl(100,100%,8%)"
        //             },
        //             "useAutomatic": true
        //         },
        //         "workbench.colorCustomizations": {
        //             "titleBar.activeBackground": "#1B5200",
        //             "titleBar.inactiveBackground": "#0E2900",
        //             "titleBar.activeForeground": "#EFFFE8",
        //             "titleBar.inactiveForeground": "#A5BB99",
        //             "activityBar.background": "#0E2900",
        //             "activityBar.foreground": "#EEFFE5"
        //         }
        //     }
        // }
        //   {
        //     "windowColors.internalSettings": {
        //         "BaseColor": "hsl(225,25%, 25%)",
        //         "portfolioAndColor": {
        //             "portfolio": "Very Dark",
        //             "coloration": "hsl(225,25%,25%)"
        //         },
        //         "useAutomatic": true,
        //         "theme": "Visual Studio Dark"
        //     },
        //     "workbench.colorCustomizations": {
        //         "titleBar.activeBackground": "#2A3F7E",
        //         "titleBar.inactiveBackground": "#203060",
        //         "titleBar.activeForeground": "#F9FAFD",
        //         "titleBar.inactiveForeground": "#A8ACB8",
        //         "activityBar.background": "#203060",
        //         "activityBar.foreground": "#FBFCFE"
        //     },
        //     "workbench.colorTheme": "Visual Studio Dark"
        // }
        let json = Tools.getLocalSettingsJsonFromDiskForWorkspace(root);
        let obj = json;
        if (json['folders'] && json['settings']) {
            obj = json['settings'];
        }
        let key;
        for (key in obj) {
            if (key.includes('windowColors')) {
                delete obj[key];
            }
        }
        delete obj["workbench.colorTheme"];
        delete obj["workbench.colorCustomizations"];
        const settingsPath = Tools.getLocalSettingsPathForWorkspace(root);
        try {
            fs.writeFileSync(settingsPath, JSON.stringify(json));
        }
        catch (err) {
            console.log('caught exception in clearExternalWorkspaceSettings', err);
        }
    }
    static deleteExternalWorkspaceSettingsMaybe(root) {
        let json = Tools.getLocalSettingsJsonFromDiskForWorkspace(root);
        let obj = json;
        if (json['folders'] && json['settings']) {
            obj = json['settings'];
        }
        if (JSON.stringify(obj) === "{}") {
            // Tools.showInformationMessage(`going to delete ${root} cos obj: ${JSON.stringify(obj)}`)
            Tools.deleteSettingsFileAndParentIfEmpty(root);
        }
    }
    // deleteExternalWorkspaceSettingsMaybe
    static deleteSettingsFileAndParentIfEmpty(root) {
        const settingsFilePath = Tools.getLocalSettingsPathForWorkspace(root);
        if (settingsFilePath !== undefined) {
            const settingsDir = path.dirname(settingsFilePath);
            //delete the local settings.json file
            fs.unlinkSync(settingsFilePath);
            try {
                fs.rmdirSync(settingsDir); //only deletes empty folders
            }
            catch (err) {
                console.log('caught expected exception: deleteSettingsFileAndParentIfEmpty: ', err);
            }
        }
    }
    static clearAllWorkspacesLocalSettings() {
        const myGlobalData = Tools.getSetting(Constants_1.C.myGlobalData);
        // if (myGlobalData === undefined) {
        //   return;
        // }
        for (let key in myGlobalData) {
            let obj = myGlobalData[key];
            if (obj && obj[Constants_1.C.internalSettings]) {
                //key is a root, not a profile name
                //so now clear out window colors settings in the settings file.  
                // return;
                Tools.clearExternalWorkspaceSettings(key);
            }
        }
    }
    static deleteAllWorkspacesLocalSettingsMaybe() {
        const myGlobalData = Tools.getSetting(Constants_1.C.myGlobalData);
        for (let key in myGlobalData) {
            let obj = myGlobalData[key];
            if (obj && obj[Constants_1.C.internalSettings]) {
                //key is a root, not a profile name
                //so now clear out window colors settings in the settings file.  
                // return;
                Tools.deleteExternalWorkspaceSettingsMaybe(key);
            }
        }
    }
    /** don't delete settings.json cos that screws stuff up. */
    static clearExtensionSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < Constants_1.C.extensionSettings.length; i++) {
                let setting = Constants_1.C.extensionSettings[i];
                yield Tools.setSetting(setting, undefined);
                yield Tools.setGlobalSetting(setting, undefined);
            }
            yield Tools.setSetting(Constants_1.C.RecentGradientColors, undefined);
            yield Tools.setGlobalSetting(Constants_1.C.RecentGradientColors, undefined);
            yield Tools.setSetting(Constants_1.C.myGlobalData, undefined);
            yield Tools.setGlobalSetting(Constants_1.C.myGlobalData, undefined);
        });
    }
    static deleteWorkspaceGlobalSettingsValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const root = Tools.getWorkspaceRoot();
            let data = Tools.getSetting(Constants_1.C.myGlobalData);
            delete data[root];
            yield Tools.setGlobalSetting(Constants_1.C.myGlobalData, data);
        });
    }
    static deleteAllGlobalData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Tools.setGlobalSetting(Constants_1.C.myGlobalData, undefined);
            yield Tools.setGlobalSetting(Constants_1.C.RecentGradientColors, undefined);
            yield Tools.setGlobalSetting(Constants_1.C.ModifyTitleBar, undefined);
            yield Tools.setGlobalSetting(Constants_1.C.ModifyActivityBar, undefined);
            yield Tools.setGlobalSetting(Constants_1.C.ModifyStatusBar, undefined);
            yield Tools.setGlobalSetting(Constants_1.C.animationStepsPerTransition, undefined);
            yield Tools.setGlobalSetting(Constants_1.C.animationMillisecondsPerStep, undefined);
            yield Tools.setGlobalSetting(Constants_1.C.AutomaticColorsPortfolio, undefined);
        });
    }
    static slightlyLighter(color) {
        const lightness = color.lightness();
        let x = 6;
        if (lightness < 30 && color.saturationl() > 10) {
            x = 3;
        }
        else if (lightness > 35 && lightness < 65) {
            x = 10;
        }
        let newColor = color.lightness(Math.min(lightness + x, 97));
        return newColor;
    }
    static makeLighter(color, x) {
        const lightness = color.lightness();
        let newColor = color.lightness(Math.min(lightness + x, 97));
        return newColor;
    }
    static slightlyDarker(color) {
        const lightness = color.lightness();
        let x = 5;
        if (lightness < 30 && color.saturationl() > 10) {
            x = 3;
        }
        let newColor = color.lightness(Math.max(lightness - x, 0));
        return newColor;
    }
    static buildNonCustomCc_helper(c, useCustomForegroundColor, adjustedBackgroundBaseColor, adjustedForegroundBaseColor) {
        let cc = {};
        if (c[Constants_1.C.ModifyTitleBar]) {
            let c = Tools.slightlyLighter(adjustedBackgroundBaseColor);
            cc[Constants_1.C.titleBar_activeBackground] = c.hex();
            cc[Constants_1.C.titleBar_inactiveBackground] = adjustedBackgroundBaseColor.hex();
            if (useCustomForegroundColor) {
                const foregroundColor = adjustedForegroundBaseColor.lighten(0.3);
                cc[Constants_1.C.titleBar_activeForeground] = foregroundColor.hex();
                let inactiveColor = foregroundColor.lightness() > adjustedBackgroundBaseColor.lightness() ? //same  v
                    foregroundColor.darken(0.3) :
                    Tools.makeLighter(foregroundColor, 35);
                inactiveColor = inactiveColor.saturate(-.8);
                cc[Constants_1.C.titleBar_inactiveForeground] = inactiveColor.hex();
            }
            else {
                const foregroundColor = colorManip_1.ColorManip.getHighContrast(c);
                cc[Constants_1.C.titleBar_activeForeground] = foregroundColor.hex();
                let inactiveColor = foregroundColor.lightness() > adjustedBackgroundBaseColor.lightness() ? //same  ^
                    foregroundColor.darken(0.3) :
                    Tools.makeLighter(foregroundColor, 35);
                inactiveColor = inactiveColor.saturate(-.8);
                cc[Constants_1.C.titleBar_inactiveForeground] = inactiveColor.hex();
            }
        }
        else {
            delete cc[Constants_1.C.titleBar_activeBackground];
            delete cc[Constants_1.C.titleBar_activeForeground];
        }
        if (c[Constants_1.C.ModifyActivityBar]) {
            cc[Constants_1.C.activityBar_background] = adjustedBackgroundBaseColor.hex();
            if (useCustomForegroundColor) {
                cc[Constants_1.C.activityBar_foreground] = adjustedForegroundBaseColor.hex();
            }
            else {
                cc[Constants_1.C.activityBar_foreground] = colorManip_1.ColorManip.getHighContrast(adjustedBackgroundBaseColor).hex();
            }
        }
        else {
            delete cc[Constants_1.C.activityBar_background];
            delete cc[Constants_1.C.activityBar_foreground];
        }
        if (c[Constants_1.C.ModifyStatusBar]) {
            let c = Tools.slightlyDarker(adjustedBackgroundBaseColor);
            cc[Constants_1.C.statusBar_background] = c.hex();
            if (useCustomForegroundColor) {
                cc[Constants_1.C.statusBar_foreground] = colorManip_1.ColorManip.getHighContrastWith(adjustedForegroundBaseColor, Color(cc[Constants_1.C.statusBar_background])).hex();
            }
            else {
                cc[Constants_1.C.statusBar_foreground] = colorManip_1.ColorManip.getMaxContrastStr(c);
            }
        }
        else {
            delete cc[Constants_1.C.statusBar_background];
            delete cc[Constants_1.C.statusBar_foreground];
        }
        return cc;
    }
    static setSomeColors(c, useCustomForegroundColor, adjustedBackgroundBaseColor, adjustedForegroundBaseColor) {
        return __awaiter(this, void 0, void 0, function* () {
            let s = Tools.getInternalSettingsObject();
            let cc = Tools.buildNonCustomCc_helper(c, useCustomForegroundColor, adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
            cc = Tools.addCustomThemeColors(s, cc);
            yield Tools.setColorCustomizations(cc);
        });
    }
    static addCustomThemeColors(s, cc) {
        //custom theme colors
        const map = s[Constants_1.C.customThemeMap]; //awefawef
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                const obj = map[key];
                const themeItem = key;
                const hex = colorManip_1.ColorManip.adjustColor(obj[Constants_1.C.customThemeBaseColor], obj[Constants_1.C.customThemeSaturation], obj[Constants_1.C.customThemeLightness]).hex();
                cc[themeItem] = hex;
            }
        }
        return cc;
    }
    /**
     *
     * @param cc
     * @param c workspaceSettings - object must contain ModifyStatuBar, title, activity
     * @param adjustedForegroundBaseColor
     */
    static setForegroundColors(cc, c, adjustedForegroundBaseColor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (c[Constants_1.C.ModifyTitleBar]) {
                cc[Constants_1.C.titleBar_activeForeground] = adjustedForegroundBaseColor.lighten(0.3).hex();
            }
            if (c[Constants_1.C.ModifyActivityBar]) {
                cc[Constants_1.C.activityBar_foreground] = adjustedForegroundBaseColor.hex();
            }
            if (c[Constants_1.C.ModifyStatusBar]) {
                cc[Constants_1.C.statusBar_foreground] = colorManip_1.ColorManip.getHighContrastWith(adjustedForegroundBaseColor, Color(cc[Constants_1.C.statusBar_background])).hex();
            }
            yield Tools.setColorCustomizations(cc);
        });
    }
    static fillCc() {
        return __awaiter(this, void 0, void 0, function* () {
            let s = Tools.getInternalSettingsObject();
            let cc = Tools.buildNonCustomCc(s);
            cc = Tools.addCustomThemeColors(s, cc);
            yield Tools.setColorCustomizations(cc);
        });
    }
    static buildCcFromInternalSettings(s) {
        let cc = Tools.buildNonCustomCc(s);
        return Tools.addCustomThemeColors(s, cc);
    }
    static buildNonCustomCc(s) {
        let c = Tools.getExtensionSettings();
        const adjustedBackgroundBaseColor = colorManip_1.ColorManip.adjustColor(s[Constants_1.C.BaseColor], s[Constants_1.C.BackgroundSaturation], s[Constants_1.C.BackgroundLightness]);
        const adjustedForegroundBaseColor = s[Constants_1.C.UseCustomForegroundColor] ?
            colorManip_1.ColorManip.adjustColor(s[Constants_1.C.ForegroundBaseColor], s[Constants_1.C.ForegroundSaturation], s[Constants_1.C.ForegroundLightness]) :
            Color('red');
        return Tools.buildNonCustomCc_helper(c, s[Constants_1.C.UseCustomForegroundColor], adjustedBackgroundBaseColor, adjustedForegroundBaseColor);
    }
    static loadSavedSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            //note - this gets all settings - even defaults that aren't written to settings.json
            //so, not all settings from globalData will b written to settings.json cos not all necessary to save there (cos defualt)
            let c = Tools.getExtensionSettings();
            const root = Tools.getWorkspaceRoot();
            let data = Tools.getSetting(Constants_1.C.myGlobalData);
            let globDataObj = data[root];
            if (globDataObj) {
                //load all C.workspaceSettings elements from globDataObj that aren't already loaded
                for (let i = 0; i < Constants_1.C.extensionSettings.length; i++) {
                    yield setSettingMaybe(globDataObj, c, Constants_1.C.extensionSettings[i]);
                }
                yield Tools.setColorCustomizations(globDataObj[Constants_1.C.colorCustomizations]);
                let internalSettings = globDataObj[Constants_1.C.internalSettings];
                if (internalSettings) {
                    const theme = internalSettings[Constants_1.C.theme];
                    if (theme) {
                        yield Tools.setTheme(theme);
                    }
                    if (internalSettings[Constants_1.C.animationDoAnimate] && internalSettings[Constants_1.C.animationGradientInputStr]) {
                        animation_1.animate(internalSettings[Constants_1.C.animationGradientInputStr]); //this runs forever.  dont put code after
                    }
                }
                return true;
            }
            return false;
        });
    }
    static saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            let obj = {};
            let c = Tools.getExtensionSettings();
            for (let i = 0; i < Constants_1.C.extensionSettings.length; i++) {
                let setting = Constants_1.C.extensionSettings[i];
                obj[setting] = c[setting];
            }
            obj[Constants_1.C.internalSettings]['theme'] = Tools.getTheme(); //just in case the user added a theme to the workspace w/out using WC commands
            obj[Constants_1.C.colorCustomizations] = Tools.getColorCustomizations();
            const root = Tools.getWorkspaceRoot();
            let myGlobalData = Tools.getSetting(Constants_1.C.myGlobalData);
            myGlobalData[root] = obj;
            yield Tools.setGlobalSetting(Constants_1.C.myGlobalData, myGlobalData);
        });
    }
}
exports.Tools = Tools;
function setSettingMaybe(globDataObj, c, settingName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (globDataObj[settingName] !== undefined && c[settingName] !== undefined && globDataObj[settingName] !== c[settingName]) {
            yield Tools.setSetting(settingName, globDataObj[settingName]);
        }
    });
}
//https://itnext.io/how-to-make-a-visual-studio-code-extension-77085dce7d82
// takes an array of workspace folder objects and return
// workspace root, assumed to be the first item in the array
const getWorkspaceFolder = (folders) => {
    if (!folders) {
        return '';
    }
    const folder = folders[0] || {};
    const uri = folder.uri;
    return uri.fsPath;
};
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
//# sourceMappingURL=tools.js.map