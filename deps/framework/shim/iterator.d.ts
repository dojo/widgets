import './Symbol';
export interface IteratorResult<T> {
    readonly done: boolean;
    readonly value: T;
}
export interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}
export interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}
export interface IterableIterator<T> extends Iterator<T> {
    [Symbol.iterator](): IterableIterator<T>;
}
/**
 * A class that _shims_ an iterator interface on array like objects.
 */
export declare class ShimIterator<T> {
    private _list;
    private _nextIndex;
    private _nativeIterator;
    constructor(list: ArrayLike<T> | Iterable<T>);
    /**
     * Return the next iteration result for the Iterator
     */
    next(): IteratorResult<T>;
    [Symbol.iterator](): IterableIterator<T>;
}
/**
 * A type guard for checking if something has an Iterable interface
 *
 * @param value The value to type guard against
 */
export declare function isIterable(value: any): value is Iterable<any>;
/**
 * A type guard for checking if something is ArrayLike
 *
 * @param value The value to type guard against
 */
export declare function isArrayLike(value: any): value is ArrayLike<any>;
/**
 * Returns the iterator for an object
 *
 * @param iterable The iterable object to return the iterator for
 */
export declare function get<T>(iterable: Iterable<T> | ArrayLike<T>): Iterator<T> | undefined;
export interface ForOfCallback<T> {
    /**
     * A callback function for a forOf() iteration
     *
     * @param value The current value
     * @param object The object being iterated over
     * @param doBreak A function, if called, will stop the iteration
     */
    (value: T, object: Iterable<T> | ArrayLike<T> | string, doBreak: () => void): void;
}
/**
 * Shims the functionality of `for ... of` blocks
 *
 * @param iterable The object the provides an interator interface
 * @param callback The callback which will be called for each item of the iterable
 * @param thisArg Optional scope to pass the callback
 */
export declare function forOf<T>(iterable: Iterable<T> | ArrayLike<T> | string, callback: ForOfCallback<T>, thisArg?: any): void;
