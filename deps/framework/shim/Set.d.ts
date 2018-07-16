import { Iterable, IterableIterator } from './iterator';
import './Symbol';
export interface Set<T> {
    /**
     * Adds a `value` to the `Set`
     *
     * @param value The value to add to the set
     * @returns The instance of the `Set`
     */
    add(value: T): this;
    /**
     * Removes all the values from the `Set`.
     */
    clear(): void;
    /**
     * Removes a `value` from the set
     *
     * @param value The value to be removed
     * @returns `true` if the value was removed
     */
    delete(value: T): boolean;
    /**
     * Returns an iterator that yields each entry.
     *
     * @return An iterator for each key/value pair in the instance.
     */
    entries(): IterableIterator<[T, T]>;
    /**
     * Executes a given function for each set entry. The function
     * is invoked with three arguments: the element value, the
     * element key, and the associated `Set` instance.
     *
     * @param callbackfn The function to execute for each map entry,
     * @param thisArg The value to use for `this` for each execution of the calback
     */
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    /**
     * Identifies if a value is part of the set.
     *
     * @param value The value to check
     * @returns `true` if the value is part of the set otherwise `false`
     */
    has(value: T): boolean;
    /**
     * Despite its name, returns an iterable of the values in the set,
     */
    keys(): IterableIterator<T>;
    /**
     * Returns the number of values in the `Set`.
     */
    readonly size: number;
    /**
     * Returns an iterable of values in the set.
     */
    values(): IterableIterator<T>;
    /** Iterates over values in the set. */
    [Symbol.iterator](): IterableIterator<T>;
    readonly [Symbol.toStringTag]: 'Set';
}
export interface SetConstructor {
    /**
     * Creates a new Set
     *
     * @constructor
     */
    new (): Set<any>;
    /**
     * Creates a new Set
     *
     * @constructor
     *
     * @param iterator The iterable structure to initialize the set with
     */
    new <T>(iterator?: T[]): Set<T>;
    /**
     * Creates a new Set
     *
     * @constructor
     *
     * @param iterator The iterable structure to initialize the set with
     */
    new <T>(iterator: Iterable<T>): Set<T>;
    readonly prototype: Set<any>;
}
export declare let Set: SetConstructor;
export default Set;
