import has from './support/has';
export const FRACTION_UNITS = Math.pow(2, 23);
export const MAX_FLOAT32 = 3.4028234663852886e38;
export const MIN_FLOAT32 = 1.401298464324817e-45;
/**
 * Returns the hyperbolic arccosine of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let acosh = Math.acosh;
/**
 * Returns the hyperbolic arcsine of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let asinh = Math.asinh;
/**
 * Returns the hyperbolic arctangent of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let atanh = Math.atanh;
/**
 * Returns the cube root of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let cbrt = Math.cbrt;
/**
 * Returns the number of leading zero bits in the 32-bit
 * binary representation of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let clz32 = Math.clz32;
/**
 * Returns the hyperbolic cosine of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let cosh = Math.cosh;
/**
 * Returns e raised to the specified power minus one.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let expm1 = Math.expm1;
/**
 * Returns the nearest single-precision float representation of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let fround = Math.fround;
/**
 * Returns the square root of the sum of squares of its arguments.
 *
 * @return The result
 */
export let hypot = Math.hypot;
/**
 * Returns the result of the 32-bit multiplication of the two parameters.
 *
 * @param n The number to use in calculation
 * @param m The number to use in calculation
 * @return The result
 */
export let imul = Math.imul;
/**
 * Returns the base 2 logarithm of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let log2 = Math.log2;
/**
 * Returns the base 10 logarithm of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let log10 = Math.log10;
/**
 * Returns the natural logarithm of 1 + a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let log1p = Math.log1p;
/**
 * Returns the sign of a number, indicating whether the number is positive.
 *
 * @param n The number to use in calculation
 * @return 1 if the number is positive, -1 if the number is negative, or 0 if the number is 0
 */
export let sign = Math.sign;
/**
 * Returns the hyperbolic sine of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let sinh = Math.sinh;
/**
 * Returns the hyperbolic tangent of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let tanh = Math.tanh;
/**
 * Returns the integral part of a number by removing any fractional digits.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export let trunc = Math.trunc;
if (!has('es6-math')) {
    acosh = function acosh(n) {
        return Math.log(n + Math.sqrt(n * n - 1));
    };
    asinh = function asinh(n) {
        if (n === -Infinity) {
            return n;
        }
        else {
            return Math.log(n + Math.sqrt(n * n + 1));
        }
    };
    atanh = function atanh(n) {
        return Math.log((1 + n) / (1 - n)) / 2;
    };
    cbrt = function cbrt(n) {
        const y = Math.pow(Math.abs(n), 1 / 3);
        return n < 0 ? -y : y;
    };
    clz32 = function clz32(n) {
        n = Number(n) >>> 0;
        return n ? 32 - n.toString(2).length : 32;
    };
    cosh = function cosh(n) {
        const m = Math.exp(n);
        return (m + 1 / m) / 2;
    };
    expm1 = function expm1(n) {
        return Math.exp(n) - 1;
    };
    fround = function (n) {
        return new Float32Array([n])[0];
    };
    hypot = function hypot(...args) {
        // See: http://mzl.la/1HDi6xP
        let n = 0;
        for (let arg of args) {
            if (arg === Infinity || arg === -Infinity) {
                return Infinity;
            }
            n += arg * arg;
        }
        return Math.sqrt(n);
    };
    log2 = function log2(n) {
        return Math.log(n) / Math.LN2;
    };
    log10 = function log10(n) {
        return Math.log(n) / Math.LN10;
    };
    log1p = function log1p(n) {
        return Math.log(1 + n);
    };
    sign = function sign(n) {
        n = Number(n);
        if (n === 0 || n !== n) {
            return n;
        }
        return n > 0 ? 1 : -1;
    };
    sinh = function sinh(n) {
        const m = Math.exp(n);
        return (m - 1 / m) / 2;
    };
    tanh = function tanh(n) {
        if (n === Infinity) {
            return 1;
        }
        else if (n === -Infinity) {
            return -1;
        }
        else {
            const y = Math.exp(2 * n);
            return (y - 1) / (y + 1);
        }
    };
    trunc = function trunc(n) {
        return n < 0 ? Math.ceil(n) : Math.floor(n);
    };
}
if (!has('es6-math-imul')) {
    imul = function imul(n, m) {
        // See: http://mzl.la/1K279FK
        const ah = (n >>> 16) & 0xffff;
        const al = n & 0xffff;
        const bh = (m >>> 16) & 0xffff;
        const bl = m & 0xffff;
        return (al * bl + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
    };
}
//# sourceMappingURL=math.mjs.map