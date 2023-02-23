"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Color = require("color");
class ColorManip {
    /** lightness ranges from -1 to 1.  values under 0 get darkened.  over 0: lightened */
    static adjustColor(base, saturation, lightness) {
        console.log("base: " + base + ', sat: ' + saturation + ', lightness: ' + lightness);
        let color = Color(base);
        color = color.saturate(saturation);
        if (lightness > 0) {
            color = color.lighten(lightness);
        }
        else if (lightness < 0) {
            color = color.darken(lightness * -1);
        }
        return color;
    }
    static getHighContrastFromStr(colorStr) {
        return ColorManip.getHighContrast(Color(colorStr));
    }
    static makeSlightlyMoreExtreme(color) {
        if (color.luminosity() > 0.375) { //a light color https://www.npmjs.com/package/color#luminosity
            return color.lighten(0.5);
        }
        else {
            return color.darken(0.5);
        }
    }
    static getHighContrast(color) {
        // console.log('getHighContrast: ' + color + " " + color.hex());
        let result;
        if (color.luminosity() > 0.375) { //a light color https://www.npmjs.com/package/color#luminosity
            result = ColorManip.getColorWithLuminosity(color, 0, 0.01);
        }
        else {
            result = ColorManip.getColorWithLuminosity(color, 0.95, 1);
        }
        // Tools.showInformationMessage('getHighContrast: ' + color.hex() + ' ' + result.hex());
        // console.log('getHighContrast: ' + color.hex() + ' ' + result.hex());
        return result;
    }
    static getMaxContrastStr(color) {
        return color.luminosity() > 0.375 ? '#000000' : '#ffffff';
    }
}
ColorManip.getColorWithLuminosity = (color, min, max) => {
    let c = Color(color.hex());
    while (c.luminosity() > max) {
        c = c.darken(0.01);
    }
    while (c.luminosity() < min) {
        c = c.lighten(0.01);
    }
    return c;
};
exports.ColorManip = ColorManip;
//# sourceMappingURL=colorTools.js.map