"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class C {
}
//user-level (global) settings only
C.RecentGradientColors = 'RecentGradientColors';
C.myGlobalData = 'globalData'; //everything about specific workspaces. 
C.AutomaticColorsPortfolio = 'AutomaticColorsPortfolio'; //string
C.overwriteAllWorkspaceColorsWithAutomaticPortfolio = 'overwriteAllWorkspaceColorsWithAutomaticPortfolio';
//workspace settings
C.internalSettings = 'internalSettings';
// static DeleteLocalSettingsOnClose = 'DeleteLocalSettingsOnClose';  //removed.  add back in if there's interest for this
C.animationMillisecondsPerStep = 'animationMillisecondsPerStep';
C.animationStepsPerTransition = 'animationStepsPerTransition';
C.ModifyActivityBar = 'ModifyActivityBar';
C.ModifyTitleBar = 'ModifyTitleBar';
C.ModifyStatusBar = 'ModifyStatusBar';
// these things get loaded in loadSettings and ... other stuff
C.extensionSettings = [
    C.internalSettings,
    // C.DeleteLocalSettingsOnClose,  //removed.  add back in if there's interest for this
    C.animationMillisecondsPerStep,
    C.animationStepsPerTransition,
    C.ModifyActivityBar,
    C.ModifyTitleBar,
    C.ModifyStatusBar,
    C.AutomaticColorsPortfolio,
    C.overwriteAllWorkspaceColorsWithAutomaticPortfolio
];
//internal -- members of C.internalSettings
C.BaseColor = 'BaseColor';
C.BackgroundSaturation = 'BackgroundSaturation';
C.BackgroundLightness = 'BackgroundLightness';
C.UseCustomForegroundColor = 'UseCustomForegroundColor';
C.ForegroundBaseColor = 'ForegroundBaseColor';
C.ForegroundSaturation = 'ForegroundSaturation';
C.ForegroundLightness = 'ForegroundLightness';
C.theme = 'theme';
C.animationGradientInputStr = 'animationGradientColors';
C.animationDoAnimate = 'animationDoAnimate';
C.customThemeMap = 'customThemeMap';
C.portfolioAndColor = 'portfolioAndColor'; //object 
C.useAutomatic = 'useAutomatic'; //true if workspace should use automatic colors.  false if workspace uses hand-picked colors
//portfolioAndColor members
C.coloration = 'coloration';
C.portfolio = 'portfolio';
//spans different objects (some in intenral settings, some in main config)
C.colorationTriggers = [
    C.BaseColor,
    C.BackgroundSaturation,
    C.BackgroundLightness,
    C.UseCustomForegroundColor,
    C.ForegroundBaseColor,
    C.ForegroundSaturation,
    C.ForegroundLightness,
    // C.theme,
    // C.animationGradientInputStr,
    // C.animationDoAnimate,
    C.customThemeMap,
    C.ModifyActivityBar,
    C.ModifyTitleBar,
    C.ModifyStatusBar
];
//customThemeMap settings:
C.customThemeItemName = 'customThemeItemName';
C.customThemeBaseColor = 'customThemeBaseColor';
C.customThemeSaturation = 'customThemeSaturation';
C.customThemeLightness = 'customThemeLightness';
//myGlobalData members:
C.savedConfigurations = 'savedConfigurations'; // @deprecated//map from saved config name to internalSettings object 
C.portfolios = 'portolios'; //map from saved config name to internalSettings object 
C.CURR_SET = 'Current setting: ';
C.CURR_SET2 = '(Current Setting)';
C.colorCustomizations = 'colorCustomizations';
C.titleBar_activeBackground = 'titleBar.activeBackground';
C.titleBar_activeForeground = 'titleBar.activeForeground';
C.titleBar_inactiveBackground = 'titleBar.inactiveBackground';
C.titleBar_inactiveForeground = 'titleBar.inactiveForeground';
// //for testing -- cos debugger mode takes away the title bar color D:
// static titleBar_activeBackground = 'sideBar.background';
// static titleBar_activeForeground = 'sideBar.foreground';
// static titleBar_inactiveBackground = 'sideBarSectionHeader.background'  ;
// static titleBar_inactiveForeground = 'sideBarSectionHeader.foreground'  ;
C.activityBar_background = 'activityBar.background';
C.activityBar_foreground = 'activityBar.foreground';
C.statusBar_background = 'statusBar.background';
C.statusBar_foreground = 'statusBar.foreground';
C.auto = 'Automatic';
C.default = 'Default Color';
C.defaultSaturation = 1;
C.defaultLightness = 0;
C.ENTER_COLOR = 'Enter color';
C.SELECT_COLOR = 'Select Color';
C.SELECT_SAT = 'Select saturation';
C.SELECT_LIGHTNESS = 'Select lightness';
C.REMOVE_COLOR = 'Restore default color';
C.TITLE_BAR = 'Title Bar (top)';
C.ACTIVITY_BAR = 'Activity Bar (left)';
C.STATUS_BAR = 'Status Bar (bottom)';
C.REMOVE_ALL_CUST_THEME_MODS = 'Remove all custom theme modifications';
C.Automatic = 'Automatic';
C.projectorEmoji = '📽';
C.paletteEmoji = '🎨';
exports.C = C;
//# sourceMappingURL=Constants.js.map