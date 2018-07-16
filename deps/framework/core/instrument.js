(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./has"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var has_1 = require("./has");
    /**
     * The default message to warn when no other is provided
     */
    var DEFAULT_DEPRECATED_MESSAGE = 'This function will be removed in future versions.';
    /**
     * When set, globalWarn will be used instead of `console.warn`
     */
    var globalWarn;
    /**
     * A function that will console warn that a function has been deprecated
     *
     * @param options Provide options which change the display of the message
     */
    function deprecated(_a) {
        var _b = _a === void 0 ? {} : _a, message = _b.message, name = _b.name, warn = _b.warn, url = _b.url;
        /* istanbul ignore else: testing with debug off is difficult */
        if (has_1.default('debug')) {
            message = message || DEFAULT_DEPRECATED_MESSAGE;
            var warning = "DEPRECATED: " + (name ? name + ': ' : '') + message;
            if (url) {
                warning += "\n\n    See " + url + " for more details.\n\n";
            }
            if (warn) {
                warn(warning);
            }
            else if (globalWarn) {
                globalWarn(warning);
            }
            else {
                console.warn(warning);
            }
        }
    }
    exports.deprecated = deprecated;
    /**
     * A function that generates before advice that can be used to warn when an API has been deprecated
     *
     * @param options Provide options which change the display of the message
     */
    function deprecatedAdvice(options) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            deprecated(options);
            return args;
        };
    }
    exports.deprecatedAdvice = deprecatedAdvice;
    /**
     * A method decorator that will console warn when a method if invoked that is deprecated
     *
     * @param options Provide options which change the display of the message
     */
    function deprecatedDecorator(options) {
        return function (target, propertyKey, descriptor) {
            if (has_1.default('debug')) {
                var originalFn_1 = descriptor.value;
                options = options || {};
                propertyKey = String(propertyKey);
                /* IE 10/11 don't have the name property on functions */
                options.name = target.constructor.name ? target.constructor.name + "#" + propertyKey : propertyKey;
                descriptor.value = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    deprecated(options);
                    return originalFn_1.apply(target, args);
                };
            }
            return descriptor;
        };
    }
    exports.deprecatedDecorator = deprecatedDecorator;
    /**
     * A function that will set the warn function that will be used instead of `console.warn` when
     * logging warning messages
     *
     * @param warn The function (or `undefined`) to use instead of `console.warn`
     */
    function setWarn(warn) {
        globalWarn = warn;
    }
    exports.setWarn = setWarn;
});
//# sourceMappingURL=instrument.js.map