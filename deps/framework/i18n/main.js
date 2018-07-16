(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./date", "./i18n", "./number", "./unit", "./util/main", "./cldr/load"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var date_1 = require("./date");
    exports.formatDate = date_1.formatDate;
    exports.formatRelativeTime = date_1.formatRelativeTime;
    exports.getDateFormatter = date_1.getDateFormatter;
    exports.getDateParser = date_1.getDateParser;
    exports.getRelativeTimeFormatter = date_1.getRelativeTimeFormatter;
    exports.parseDate = date_1.parseDate;
    var i18n_1 = require("./i18n");
    exports.formatMessage = i18n_1.formatMessage;
    exports.getCachedMessages = i18n_1.getCachedMessages;
    exports.getMessageFormatter = i18n_1.getMessageFormatter;
    exports.invalidate = i18n_1.invalidate;
    exports.setLocaleMessages = i18n_1.setLocaleMessages;
    exports.switchLocale = i18n_1.switchLocale;
    exports.systemLocale = i18n_1.systemLocale;
    var number_1 = require("./number");
    exports.formatCurrency = number_1.formatCurrency;
    exports.formatNumber = number_1.formatNumber;
    exports.getCurrencyFormatter = number_1.getCurrencyFormatter;
    exports.getNumberFormatter = number_1.getNumberFormatter;
    exports.getNumberParser = number_1.getNumberParser;
    exports.getPluralGenerator = number_1.getPluralGenerator;
    exports.parseNumber = number_1.parseNumber;
    exports.pluralize = number_1.pluralize;
    var unit_1 = require("./unit");
    exports.formatUnit = unit_1.formatUnit;
    exports.getUnitFormatter = unit_1.getUnitFormatter;
    var main_1 = require("./util/main");
    exports.generateLocales = main_1.generateLocales;
    exports.normalizeLocale = main_1.normalizeLocale;
    var load_1 = require("./cldr/load");
    exports.loadCldrData = load_1.default;
    exports.default = i18n_1.default;
});
//# sourceMappingURL=main.js.map