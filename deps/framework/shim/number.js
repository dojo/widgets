(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./global"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var global_1 = require("./global");
    /**
     * The smallest interval between two representable numbers.
     */
    exports.EPSILON = 1;
    /**
     * The maximum safe integer in JavaScript
     */
    exports.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
    /**
     * The minimum safe integer in JavaScript
     */
    exports.MIN_SAFE_INTEGER = -exports.MAX_SAFE_INTEGER;
    /**
     * Determines whether the passed value is NaN without coersion.
     *
     * @param value The value to test
     * @return true if the value is NaN, false if it is not
     */
    function isNaN(value) {
        return typeof value === 'number' && global_1.default.isNaN(value);
    }
    exports.isNaN = isNaN;
    /**
     * Determines whether the passed value is a finite number without coersion.
     *
     * @param value The value to test
     * @return true if the value is finite, false if it is not
     */
    function isFinite(value) {
        return typeof value === 'number' && global_1.default.isFinite(value);
    }
    exports.isFinite = isFinite;
    /**
     * Determines whether the passed value is an integer.
     *
     * @param value The value to test
     * @return true if the value is an integer, false if it is not
     */
    function isInteger(value) {
        return isFinite(value) && Math.floor(value) === value;
    }
    exports.isInteger = isInteger;
    /**
     * Determines whether the passed value is an integer that is 'safe,' meaning:
     *   1. it can be expressed as an IEEE-754 double precision number
     *   2. it has a one-to-one mapping to a mathematical integer, meaning its
     *      IEEE-754 representation cannot be the result of rounding any other
     *      integer to fit the IEEE-754 representation
     *
     * @param value The value to test
     * @return true if the value is an integer, false if it is not
     */
    function isSafeInteger(value) {
        return isInteger(value) && Math.abs(value) <= exports.MAX_SAFE_INTEGER;
    }
    exports.isSafeInteger = isSafeInteger;
});
//# sourceMappingURL=number.js.map