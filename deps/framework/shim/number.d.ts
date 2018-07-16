/**
 * The smallest interval between two representable numbers.
 */
export declare const EPSILON = 1;
/**
 * The maximum safe integer in JavaScript
 */
export declare const MAX_SAFE_INTEGER: number;
/**
 * The minimum safe integer in JavaScript
 */
export declare const MIN_SAFE_INTEGER: number;
/**
 * Determines whether the passed value is NaN without coersion.
 *
 * @param value The value to test
 * @return true if the value is NaN, false if it is not
 */
export declare function isNaN(value: any): boolean;
/**
 * Determines whether the passed value is a finite number without coersion.
 *
 * @param value The value to test
 * @return true if the value is finite, false if it is not
 */
export declare function isFinite(value: any): value is number;
/**
 * Determines whether the passed value is an integer.
 *
 * @param value The value to test
 * @return true if the value is an integer, false if it is not
 */
export declare function isInteger(value: any): value is number;
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
export declare function isSafeInteger(value: any): value is number;
