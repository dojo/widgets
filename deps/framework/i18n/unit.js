(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "globalize/dist/globalize", "globalize/dist/globalize/number", "globalize/dist/globalize/plural", "globalize/dist/globalize/unit", "./util/globalize"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("globalize/dist/globalize");
    require("globalize/dist/globalize/number");
    require("globalize/dist/globalize/plural");
    require("globalize/dist/globalize/unit");
    var globalize_1 = require("./util/globalize");
    function formatUnit(value, unit, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('formatUnit', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            unit: unit,
            value: value
        });
    }
    exports.formatUnit = formatUnit;
    function getUnitFormatter(unit, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('unitFormatter', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            unit: unit
        });
    }
    exports.getUnitFormatter = getUnitFormatter;
});
//# sourceMappingURL=unit.js.map