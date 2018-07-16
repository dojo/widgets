(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./support/has"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var has_1 = require("./support/has");
    exports.FRACTION_UNITS = Math.pow(2, 23);
    exports.MAX_FLOAT32 = 3.4028234663852886e38;
    exports.MIN_FLOAT32 = 1.401298464324817e-45;
    /**
     * Returns the hyperbolic arccosine of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.acosh = Math.acosh;
    /**
     * Returns the hyperbolic arcsine of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.asinh = Math.asinh;
    /**
     * Returns the hyperbolic arctangent of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.atanh = Math.atanh;
    /**
     * Returns the cube root of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.cbrt = Math.cbrt;
    /**
     * Returns the number of leading zero bits in the 32-bit
     * binary representation of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.clz32 = Math.clz32;
    /**
     * Returns the hyperbolic cosine of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.cosh = Math.cosh;
    /**
     * Returns e raised to the specified power minus one.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.expm1 = Math.expm1;
    /**
     * Returns the nearest single-precision float representation of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.fround = Math.fround;
    /**
     * Returns the square root of the sum of squares of its arguments.
     *
     * @return The result
     */
    exports.hypot = Math.hypot;
    /**
     * Returns the result of the 32-bit multiplication of the two parameters.
     *
     * @param n The number to use in calculation
     * @param m The number to use in calculation
     * @return The result
     */
    exports.imul = Math.imul;
    /**
     * Returns the base 2 logarithm of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.log2 = Math.log2;
    /**
     * Returns the base 10 logarithm of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.log10 = Math.log10;
    /**
     * Returns the natural logarithm of 1 + a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.log1p = Math.log1p;
    /**
     * Returns the sign of a number, indicating whether the number is positive.
     *
     * @param n The number to use in calculation
     * @return 1 if the number is positive, -1 if the number is negative, or 0 if the number is 0
     */
    exports.sign = Math.sign;
    /**
     * Returns the hyperbolic sine of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.sinh = Math.sinh;
    /**
     * Returns the hyperbolic tangent of a number.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.tanh = Math.tanh;
    /**
     * Returns the integral part of a number by removing any fractional digits.
     *
     * @param n The number to use in calculation
     * @return The result
     */
    exports.trunc = Math.trunc;
    if (!has_1.default('es6-math')) {
        exports.acosh = function acosh(n) {
            return Math.log(n + Math.sqrt(n * n - 1));
        };
        exports.asinh = function asinh(n) {
            if (n === -Infinity) {
                return n;
            }
            else {
                return Math.log(n + Math.sqrt(n * n + 1));
            }
        };
        exports.atanh = function atanh(n) {
            return Math.log((1 + n) / (1 - n)) / 2;
        };
        exports.cbrt = function cbrt(n) {
            var y = Math.pow(Math.abs(n), 1 / 3);
            return n < 0 ? -y : y;
        };
        exports.clz32 = function clz32(n) {
            n = Number(n) >>> 0;
            return n ? 32 - n.toString(2).length : 32;
        };
        exports.cosh = function cosh(n) {
            var m = Math.exp(n);
            return (m + 1 / m) / 2;
        };
        exports.expm1 = function expm1(n) {
            return Math.exp(n) - 1;
        };
        exports.fround = function (n) {
            return new Float32Array([n])[0];
        };
        exports.hypot = function hypot() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // See: http://mzl.la/1HDi6xP
            var n = 0;
            try {
                for (var args_1 = tslib_1.__values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                    var arg = args_1_1.value;
                    if (arg === Infinity || arg === -Infinity) {
                        return Infinity;
                    }
                    n += arg * arg;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return Math.sqrt(n);
            var e_1, _a;
        };
        exports.log2 = function log2(n) {
            return Math.log(n) / Math.LN2;
        };
        exports.log10 = function log10(n) {
            return Math.log(n) / Math.LN10;
        };
        exports.log1p = function log1p(n) {
            return Math.log(1 + n);
        };
        exports.sign = function sign(n) {
            n = Number(n);
            if (n === 0 || n !== n) {
                return n;
            }
            return n > 0 ? 1 : -1;
        };
        exports.sinh = function sinh(n) {
            var m = Math.exp(n);
            return (m - 1 / m) / 2;
        };
        exports.tanh = function tanh(n) {
            if (n === Infinity) {
                return 1;
            }
            else if (n === -Infinity) {
                return -1;
            }
            else {
                var y = Math.exp(2 * n);
                return (y - 1) / (y + 1);
            }
        };
        exports.trunc = function trunc(n) {
            return n < 0 ? Math.ceil(n) : Math.floor(n);
        };
    }
    if (!has_1.default('es6-math-imul')) {
        exports.imul = function imul(n, m) {
            // See: http://mzl.la/1K279FK
            var ah = (n >>> 16) & 0xffff;
            var al = n & 0xffff;
            var bh = (m >>> 16) & 0xffff;
            var bl = m & 0xffff;
            return (al * bl + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
        };
    }
});
//# sourceMappingURL=math.js.map