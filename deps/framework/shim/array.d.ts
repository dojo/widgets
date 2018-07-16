import { Iterable } from './iterator';
export interface MapCallback<T, U> {
    /**
     * A callback function when mapping
     *
     * @param element The element that is currently being mapped
     * @param index The current index of the element
     */
    (element: T, index: number): U;
}
export interface FindCallback<T> {
    /**
     * A callback function when using find
     *
     * @param element The element that is currenty being analysed
     * @param index The current index of the element that is being analysed
     * @param array The source array
     */
    (element: T, index: number, array: ArrayLike<T>): boolean;
}
export interface From {
    /**
     * The Array.from() method creates a new Array instance from an array-like or iterable object.
     *
     * @param source An array-like or iterable object to convert to an array
     * @param mapFunction A map function to call on each element in the array
     * @param thisArg The execution context for the map function
     * @return The new Array
     */
    <T, U>(source: ArrayLike<T> | Iterable<T>, mapFunction: MapCallback<T, U>, thisArg?: any): Array<U>;
    /**
     * The Array.from() method creates a new Array instance from an array-like or iterable object.
     *
     * @param source An array-like or iterable object to convert to an array
     * @return The new Array
     */
    <T>(source: ArrayLike<T> | Iterable<T>): Array<T>;
}
export declare let from: From;
/**
 * Creates a new array from the function parameters.
 *
 * @param arguments Any number of arguments for the array
 * @return An array from the given arguments
 */
export declare let of: <T>(...items: T[]) => Array<T>;
/**
 * Copies data internally within an array or array-like object.
 *
 * @param target The target array-like object
 * @param offset The index to start copying values to; if negative, it counts backwards from length
 * @param start The first (inclusive) index to copy; if negative, it counts backwards from length
 * @param end The last (exclusive) index to copy; if negative, it counts backwards from length
 * @return The target
 */
export declare let copyWithin: <T>(target: ArrayLike<T>, offset: number, start: number, end?: number) => ArrayLike<T>;
/**
 * Fills elements of an array-like object with the specified value.
 *
 * @param target The target to fill
 * @param value The value to fill each element of the target with
 * @param start The first index to fill
 * @param end The (exclusive) index at which to stop filling
 * @return The filled target
 */
export declare let fill: <T>(target: ArrayLike<T>, value: T, start?: number, end?: number) => ArrayLike<T>;
/**
 * Finds and returns the first instance matching the callback or undefined if one is not found.
 *
 * @param target An array-like object
 * @param callback A function returning if the current value matches a criteria
 * @param thisArg The execution context for the find function
 * @return The first element matching the callback, or undefined if one does not exist
 */
export declare let find: <T>(target: ArrayLike<T>, callback: FindCallback<T>, thisArg?: {}) => T | undefined;
/**
 * Performs a linear search and returns the first index whose value satisfies the passed callback,
 * or -1 if no values satisfy it.
 *
 * @param target An array-like object
 * @param callback A function returning true if the current value satisfies its criteria
 * @param thisArg The execution context for the find function
 * @return The first index whose value satisfies the passed callback, or -1 if no values satisfy it
 */
export declare let findIndex: <T>(target: ArrayLike<T>, callback: FindCallback<T>, thisArg?: {}) => number;
/**
 * Determines whether an array includes a given value
 *
 * @param target the target array-like object
 * @param searchElement the item to search for
 * @param fromIndex the starting index to search from
 * @return `true` if the array includes the element, otherwise `false`
 */
export declare let includes: <T>(target: ArrayLike<T>, searchElement: T, fromIndex?: number) => boolean;
