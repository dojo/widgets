import { Iterable, IterableIterator } from './iterator';
import './Symbol';
export interface Map<K, V> {
    /**
     * Deletes all keys and their associated values.
     */
    clear(): void;
    /**
     * Deletes a given key and its associated value.
     *
     * @param key The key to delete
     * @return true if the key exists, false if it does not
     */
    delete(key: K): boolean;
    /**
     * Returns an iterator that yields each key/value pair as an array.
     *
     * @return An iterator for each key/value pair in the instance.
     */
    entries(): IterableIterator<[K, V]>;
    /**
     * Executes a given function for each map entry. The function
     * is invoked with three arguments: the element value, the
     * element key, and the associated Map instance.
     *
     * @param callbackfn The function to execute for each map entry,
     * @param thisArg The value to use for `this` for each execution of the calback
     */
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    /**
     * Returns the value associated with a given key.
     *
     * @param key The key to look up
     * @return The value if one exists or undefined
     */
    get(key: K): V | undefined;
    /**
     * Returns an iterator that yields each key in the map.
     *
     * @return An iterator containing the instance's keys.
     */
    keys(): IterableIterator<K>;
    /**
     * Checks for the presence of a given key.
     *
     * @param key The key to check for
     * @return true if the key exists, false if it does not
     */
    has(key: K): boolean;
    /**
     * Sets the value associated with a given key.
     *
     * @param key The key to define a value to
     * @param value The value to assign
     * @return The Map instance
     */
    set(key: K, value: V): this;
    /**
     * Returns the number of key / value pairs in the Map.
     */
    readonly size: number;
    /**
     * Returns an iterator that yields each value in the map.
     *
     * @return An iterator containing the instance's values.
     */
    values(): IterableIterator<V>;
    /** Returns an iterable of entries in the map. */
    [Symbol.iterator](): IterableIterator<[K, V]>;
    readonly [Symbol.toStringTag]: string;
}
export interface MapConstructor {
    /**
     * Creates a new Map
     *
     * @constructor
     */
    new (): Map<any, any>;
    /**
     * Creates a new Map
     *
     * @constructor
     *
     * @param iterator
     * Array or iterator containing two-item tuples used to initially populate the map.
     * The first item in each tuple corresponds to the key of the map entry.
     * The second item corresponds to the value of the map entry.
     */
    new <K, V>(iterator?: [K, V][]): Map<K, V>;
    /**
     * Creates a new Map
     *
     * @constructor
     *
     * @param iterator
     * Array or iterator containing two-item tuples used to initially populate the map.
     * The first item in each tuple corresponds to the key of the map entry.
     * The second item corresponds to the value of the map entry.
     */
    new <K, V>(iterator: Iterable<[K, V]>): Map<K, V>;
    readonly prototype: Map<any, any>;
    readonly [Symbol.species]: MapConstructor;
}
export declare let Map: MapConstructor;
export default Map;
