(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "globalize/dist/globalize", "globalize/dist/globalize/number", "globalize/dist/globalize/date", "globalize/dist/globalize/relative-time", "./util/globalize"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("globalize/dist/globalize");
    require("globalize/dist/globalize/number");
    require("globalize/dist/globalize/date");
    require("globalize/dist/globalize/relative-time");
    var globalize_1 = require("./util/globalize");
    function formatDate(value, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('formatDate', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            value: value
        });
    }
    exports.formatDate = formatDate;
    function formatRelativeTime(value, unit, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('formatRelativeTime', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            unit: unit,
            value: value
        });
    }
    exports.formatRelativeTime = formatRelativeTime;
    function getDateFormatter(optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('dateFormatter', {
            locale: locale,
            optionsOrLocale: optionsOrLocale
        });
    }
    exports.getDateFormatter = getDateFormatter;
    function getDateParser(optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('dateParser', {
            locale: locale,
            optionsOrLocale: optionsOrLocale
        });
    }
    exports.getDateParser = getDateParser;
    function getRelativeTimeFormatter(unit, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('relativeTimeFormatter', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            unit: unit
        });
    }
    exports.getRelativeTimeFormatter = getRelativeTimeFormatter;
    function parseDate(value, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('parseDate', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            value: value
        });
    }
    exports.parseDate = parseDate;
});
//# sourceMappingURL=date.js.map