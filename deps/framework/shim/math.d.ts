export declare const FRACTION_UNITS: number;
export declare const MAX_FLOAT32 = 3.4028234663852886e+38;
export declare const MIN_FLOAT32 = 1.401298464324817e-45;
/**
 * Returns the hyperbolic arccosine of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let acosh: (n: number) => number;
/**
 * Returns the hyperbolic arcsine of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let asinh: (n: number) => number;
/**
 * Returns the hyperbolic arctangent of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let atanh: (n: number) => number;
/**
 * Returns the cube root of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let cbrt: (n: number) => number;
/**
 * Returns the number of leading zero bits in the 32-bit
 * binary representation of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let clz32: (n: number) => number;
/**
 * Returns the hyperbolic cosine of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let cosh: (n: number) => number;
/**
 * Returns e raised to the specified power minus one.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let expm1: (n: number) => number;
/**
 * Returns the nearest single-precision float representation of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let fround: (n: number) => number;
/**
 * Returns the square root of the sum of squares of its arguments.
 *
 * @return The result
 */
export declare let hypot: (...args: number[]) => number;
/**
 * Returns the result of the 32-bit multiplication of the two parameters.
 *
 * @param n The number to use in calculation
 * @param m The number to use in calculation
 * @return The result
 */
export declare let imul: (n: number, m: number) => number;
/**
 * Returns the base 2 logarithm of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let log2: (n: number) => number;
/**
 * Returns the base 10 logarithm of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let log10: (n: number) => number;
/**
 * Returns the natural logarithm of 1 + a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let log1p: (n: number) => number;
/**
 * Returns the sign of a number, indicating whether the number is positive.
 *
 * @param n The number to use in calculation
 * @return 1 if the number is positive, -1 if the number is negative, or 0 if the number is 0
 */
export declare let sign: (n: number) => number;
/**
 * Returns the hyperbolic sine of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let sinh: (n: number) => number;
/**
 * Returns the hyperbolic tangent of a number.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let tanh: (n: number) => number;
/**
 * Returns the integral part of a number by removing any fractional digits.
 *
 * @param n The number to use in calculation
 * @return The result
 */
export declare let trunc: (n: number) => number;
