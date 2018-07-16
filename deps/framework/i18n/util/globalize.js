(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "globalize/dist/globalize", "../i18n"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Globalize = require("globalize/dist/globalize");
    var i18n_1 = require("../i18n");
    /**
     * @private
     * Normalize an array of formatter arguments into a discrete object with `locale`, `options`, `value` and
     * `unit` properties for use with the various Globalize.js formatter methods.
     *
     * @param args
     * An object with an optional locale, options, value, and/or unit.
     *
     * @return
     * The normalized object map.
     */
    function normalizeFormatterArguments(args) {
        var _a = args, locale = _a.locale, optionsOrLocale = _a.optionsOrLocale, unit = _a.unit, value = _a.value;
        var options = optionsOrLocale;
        if (typeof optionsOrLocale === 'string') {
            locale = optionsOrLocale;
            options = undefined;
        }
        return { locale: locale, options: options, unit: unit, value: value };
    }
    /**
     * Return a Globalize.js object for the specified locale. If no locale is provided, then the root
     * locale is assumed.
     *
     * @param string
     * An optional locale for the Globalize.js object.
     *
     * @return
     * The localized Globalize.js object.
     */
    function getGlobalize(locale) {
        return locale && locale !== i18n_1.default.locale ? new Globalize(locale) : Globalize;
    }
    exports.default = getGlobalize;
    function globalizeDelegator(method, args) {
        var _a = normalizeFormatterArguments(args), locale = _a.locale, options = _a.options, value = _a.value, unit = _a.unit;
        var methodArgs = typeof value !== 'undefined' ? [value] : [];
        if (typeof unit !== 'undefined') {
            methodArgs.push(unit);
        }
        if (typeof options !== 'undefined') {
            methodArgs.push(options);
        }
        var globalize = getGlobalize(locale);
        return globalize[method].apply(globalize, methodArgs);
    }
    exports.globalizeDelegator = globalizeDelegator;
});
//# sourceMappingURL=globalize.js.map