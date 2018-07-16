import { Iterable } from './iterator';
import './Symbol';
export interface WeakMap<K extends object, V> {
    /**
     * Remove a `key` from the map
     *
     * @param key The key to remove
     * @return `true` if the value was removed, otherwise `false`
     */
    delete(key: K): boolean;
    /**
     * Retrieve the value, based on the supplied `key`
     *
     * @param key The key to retrieve the `value` for
     * @return the `value` based on the `key` if found, otherwise `false`
     */
    get(key: K): V | undefined;
    /**
     * Determines if a `key` is present in the map
     *
     * @param key The `key` to check
     * @return `true` if the key is part of the map, otherwise `false`.
     */
    has(key: K): boolean;
    /**
     * Set a `value` for a particular `key`.
     *
     * @param key The `key` to set the `value` for
     * @param value The `value` to set
     * @return the instances
     */
    set(key: K, value: V): this;
    readonly [Symbol.toStringTag]: 'WeakMap';
}
export interface WeakMapConstructor {
    /**
     * Create a new instance of a `WeakMap`
     *
     * @constructor
     */
    new (): WeakMap<object, any>;
    /**
     * Create a new instance of a `WeakMap`
     *
     * @constructor
     *
     * @param iterable An iterable that contains yields up key/value pair entries
     */
    new <K extends object, V>(iterable?: [K, V][]): WeakMap<K, V>;
    /**
     * Create a new instance of a `WeakMap`
     *
     * @constructor
     *
     * @param iterable An iterable that contains yields up key/value pair entries
     */
    new <K extends object, V>(iterable: Iterable<[K, V]>): WeakMap<K, V>;
    readonly prototype: WeakMap<object, any>;
}
export declare let WeakMap: WeakMapConstructor;
export default WeakMap;
