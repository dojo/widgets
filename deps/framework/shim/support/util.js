(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Helper function to generate a value property descriptor
     *
     * @param value        The value the property descriptor should be set to
     * @param enumerable   If the property should be enumberable, defaults to false
     * @param writable     If the property should be writable, defaults to true
     * @param configurable If the property should be configurable, defaults to true
     * @return             The property descriptor object
     */
    function getValueDescriptor(value, enumerable, writable, configurable) {
        if (enumerable === void 0) { enumerable = false; }
        if (writable === void 0) { writable = true; }
        if (configurable === void 0) { configurable = true; }
        return {
            value: value,
            enumerable: enumerable,
            writable: writable,
            configurable: configurable
        };
    }
    exports.getValueDescriptor = getValueDescriptor;
    function wrapNative(nativeFunction) {
        return function (target) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return nativeFunction.apply(target, args);
        };
    }
    exports.wrapNative = wrapNative;
});
//# sourceMappingURL=util.js.map