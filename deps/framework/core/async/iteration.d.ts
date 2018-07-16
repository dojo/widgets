import { Iterable } from '../../shim/iterator';
import { Thenable } from '../../shim/interfaces';
/**
 * Test whether all elements in the array pass the provided callback
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous test
 * @return eventually returns true if all values pass; otherwise false
 */
export declare function every<T>(items: Iterable<T | Promise<T>> | (T | Promise<T>)[], callback: Filterer<T>): Promise<boolean>;
/**
 * Returns an array of elements which pass the provided callback
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous test
 * @return eventually returns a new array with only values that have passed
 */
export declare function filter<T>(items: Iterable<T | Promise<T>> | (T | Promise<T>)[], callback: Filterer<T>): Promise<T[]>;
/**
 * Find the first value matching a filter function
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous test
 * @return a promise eventually containing the item or undefined if a match is not found
 */
export declare function find<T>(items: Iterable<T | Promise<T>> | (T | Promise<T>)[], callback: Filterer<T>): Promise<T | undefined>;
/**
 * Find the first index with a value matching the filter function
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous test
 * @return a promise eventually containing the index of the matching item or -1 if a match is not found
 */
export declare function findIndex<T>(items: Iterable<T | Promise<T>> | (T | Thenable<T>)[], callback: Filterer<T>): Promise<number>;
/**
 * transform a list of items using a mapper function
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous transform function
 * @return a promise eventually containing a collection of each transformed value
 */
export declare function map<T, U>(items: Iterable<T | Promise<T>> | (T | Promise<T>)[], callback: Mapper<T, U>): Promise<U[] | null | undefined>;
/**
 * reduce a list of items down to a single value
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous reducer function
 * @param [initialValue] the first value to pass to the callback
 * @return a promise eventually containing a value that is the result of the reduction
 */
export declare function reduce<T, U>(this: any, items: Iterable<T | Promise<T>> | (T | Promise<T>)[], callback: Reducer<T, U>, initialValue?: U): Promise<U>;
export declare function reduceRight<T, U>(this: any, items: Iterable<T | Promise<T>> | (T | Promise<T>)[], callback: Reducer<T, U>, initialValue?: U): Promise<U>;
export declare function series<T, U>(items: Iterable<T | Promise<T>> | (T | Promise<T>)[], operation: Mapper<T, U>): Promise<U[]>;
export declare function some<T>(items: Iterable<T | Promise<T>> | Array<T | Promise<T>>, callback: Filterer<T>): Promise<boolean>;
export interface Filterer<T> extends Mapper<T, boolean> {
}
export interface Mapper<T, U> {
    (value: T, index: number, array: T[]): U | Thenable<U>;
}
export interface Reducer<T, U> {
    (previousValue: U, currentValue: T, index: number, array: T[]): U | Thenable<U>;
}
