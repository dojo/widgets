(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "globalize/dist/globalize", "globalize/dist/globalize/number", "globalize/dist/globalize/plural", "globalize/dist/globalize/currency", "./util/globalize"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("globalize/dist/globalize");
    require("globalize/dist/globalize/number");
    require("globalize/dist/globalize/plural");
    require("globalize/dist/globalize/currency");
    var globalize_1 = require("./util/globalize");
    function formatCurrency(value, currency, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('formatCurrency', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            unit: currency,
            value: value
        });
    }
    exports.formatCurrency = formatCurrency;
    function formatNumber(value, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('formatNumber', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            value: value
        });
    }
    exports.formatNumber = formatNumber;
    function getCurrencyFormatter(currency, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('currencyFormatter', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            unit: currency
        });
    }
    exports.getCurrencyFormatter = getCurrencyFormatter;
    function getNumberFormatter(optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('numberFormatter', {
            locale: locale,
            optionsOrLocale: optionsOrLocale
        });
    }
    exports.getNumberFormatter = getNumberFormatter;
    function getNumberParser(optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('numberParser', {
            locale: locale,
            optionsOrLocale: optionsOrLocale
        });
    }
    exports.getNumberParser = getNumberParser;
    function getPluralGenerator(optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('pluralGenerator', {
            locale: locale,
            optionsOrLocale: optionsOrLocale
        });
    }
    exports.getPluralGenerator = getPluralGenerator;
    function parseNumber(value, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('parseNumber', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            value: value
        });
    }
    exports.parseNumber = parseNumber;
    function pluralize(value, optionsOrLocale, locale) {
        return globalize_1.globalizeDelegator('plural', {
            locale: locale,
            optionsOrLocale: optionsOrLocale,
            value: value
        });
    }
    exports.pluralize = pluralize;
});
//# sourceMappingURL=number.js.map