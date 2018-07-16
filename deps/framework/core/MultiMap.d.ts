import { Iterable, IterableIterator } from '../shim/iterator';
import Map from '../shim/Map';
import '../shim/Symbol';
/**
 * A map implmentation that supports multiple keys for specific value.
 *
 * @param T Accepts the type of the value
 */
export declare class MultiMap<T> implements Map<any[], T> {
    private _map;
    private _key;
    /**
     * @constructor
     *
     * @param iterator an array or iterator of tuples to initialize the map with.
     */
    constructor(iterable?: ArrayLike<[any[], T]> | Iterable<[any[], T]>);
    /**
     * Sets the value for the array of keys provided
     *
     * @param keys The array of keys to store the value against
     * @param value the value of the map entry
     *
     * @return the multi map instance
     */
    set(keys: any[], value: T): this;
    /**
     * Returns the value entry for the array of keys
     *
     * @param keys The array of keys to look up the value for
     *
     * @return The value if found otherwise `undefined`
     */
    get(keys: any[]): T | undefined;
    /**
     * Returns a boolean indicating if the key exists in the map
     *
     * @return boolean true if the key exists otherwise false
     */
    has(keys: any[]): boolean;
    /**
     * Returns the size of the map, based on the number of unique keys
     */
    readonly size: number;
    /**
     * Deletes the entry for the key provided.
     *
     * @param keys the key of the entry to remove
     * @return boolean trus if the entry was deleted, false if the entry was not found
     */
    delete(keys: any[]): boolean;
    /**
     * Return an iterator that yields each value in the map
     *
     * @return An iterator containing the instance's values.
     */
    values(): IterableIterator<T>;
    /**
     * Return an iterator that yields each key array in the map
     *
     * @return An iterator containing the instance's keys.
     */
    keys(): IterableIterator<any[]>;
    /**
     * Returns an iterator that yields each key/value pair as an array.
     *
     * @return An iterator for each key/value pair in the instance.
     */
    entries(): IterableIterator<[any[], T]>;
    /**
     * Executes a given function for each map entry. The function
     * is invoked with three arguments: the element value, the
     * element key, and the associated Map instance.
     *
     * @param callback The function to execute for each map entry,
     * @param context The value to use for `this` for each execution of the calback
     */
    forEach(callback: (value: T, key: any[], mapInstance: MultiMap<T>) => any, context?: {}): void;
    /**
     * Deletes all keys and their associated values.
     */
    clear(): void;
    [Symbol.iterator](): IterableIterator<[any[], T]>;
    [Symbol.toStringTag]: string;
}
export default MultiMap;
