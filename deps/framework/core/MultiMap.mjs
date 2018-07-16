import { from as arrayFrom } from '../shim/array';
import { isArrayLike, isIterable, ShimIterator } from '../shim/iterator';
import Map from '../shim/Map';
import '../shim/Symbol';
/**
 * A map implmentation that supports multiple keys for specific value.
 *
 * @param T Accepts the type of the value
 */
export class MultiMap {
    /**
     * @constructor
     *
     * @param iterator an array or iterator of tuples to initialize the map with.
     */
    constructor(iterable) {
        this[Symbol.toStringTag] = 'MultiMap';
        this._map = new Map();
        this._key = Symbol();
        if (iterable) {
            if (isArrayLike(iterable)) {
                for (let i = 0; i < iterable.length; i++) {
                    const value = iterable[i];
                    this.set(value[0], value[1]);
                }
            }
            else if (isIterable(iterable)) {
                for (const value of iterable) {
                    this.set(value[0], value[1]);
                }
            }
        }
    }
    /**
     * Sets the value for the array of keys provided
     *
     * @param keys The array of keys to store the value against
     * @param value the value of the map entry
     *
     * @return the multi map instance
     */
    set(keys, value) {
        let map = this._map;
        let childMap;
        for (let i = 0; i < keys.length; i++) {
            if (map.get(keys[i])) {
                map = map.get(keys[i]);
                continue;
            }
            childMap = new Map();
            map.set(keys[i], childMap);
            map = childMap;
        }
        map.set(this._key, value);
        return this;
    }
    /**
     * Returns the value entry for the array of keys
     *
     * @param keys The array of keys to look up the value for
     *
     * @return The value if found otherwise `undefined`
     */
    get(keys) {
        let map = this._map;
        for (let i = 0; i < keys.length; i++) {
            map = map.get(keys[i]);
            if (!map) {
                return undefined;
            }
        }
        return map.get(this._key);
    }
    /**
     * Returns a boolean indicating if the key exists in the map
     *
     * @return boolean true if the key exists otherwise false
     */
    has(keys) {
        let map = this._map;
        for (let i = 0; i < keys.length; i++) {
            map = map.get(keys[i]);
            if (!map) {
                return false;
            }
        }
        return true;
    }
    /**
     * Returns the size of the map, based on the number of unique keys
     */
    get size() {
        return arrayFrom(this.keys()).length;
    }
    /**
     * Deletes the entry for the key provided.
     *
     * @param keys the key of the entry to remove
     * @return boolean trus if the entry was deleted, false if the entry was not found
     */
    delete(keys) {
        let map = this._map;
        const path = [this._map];
        for (let i = 0; i < keys.length; i++) {
            map = map.get(keys[i]);
            path.push(map);
            if (!map) {
                return false;
            }
        }
        map.delete(this._key);
        for (let i = keys.length - 1; i >= 0; i--) {
            map = path[i].get(keys[i]);
            if (map.size) {
                break;
            }
            path[i].delete(keys[i]);
        }
        return true;
    }
    /**
     * Return an iterator that yields each value in the map
     *
     * @return An iterator containing the instance's values.
     */
    values() {
        const values = [];
        const getValues = (map) => {
            map.forEach((value, key) => {
                if (key === this._key) {
                    values.push(value);
                }
                else {
                    getValues(value);
                }
            });
        };
        getValues(this._map);
        return new ShimIterator(values);
    }
    /**
     * Return an iterator that yields each key array in the map
     *
     * @return An iterator containing the instance's keys.
     */
    keys() {
        const finalKeys = [];
        const getKeys = (map, keys = []) => {
            map.forEach((value, key) => {
                if (key === this._key) {
                    finalKeys.push(keys);
                }
                else {
                    const nextKeys = [...keys, key];
                    getKeys(value, nextKeys);
                }
            });
        };
        getKeys(this._map);
        return new ShimIterator(finalKeys);
    }
    /**
     * Returns an iterator that yields each key/value pair as an array.
     *
     * @return An iterator for each key/value pair in the instance.
     */
    entries() {
        const finalEntries = [];
        const getKeys = (map, keys = []) => {
            map.forEach((value, key) => {
                if (key === this._key) {
                    finalEntries.push([keys, value]);
                }
                else {
                    const nextKeys = [...keys, key];
                    getKeys(value, nextKeys);
                }
            });
        };
        getKeys(this._map);
        return new ShimIterator(finalEntries);
    }
    /**
     * Executes a given function for each map entry. The function
     * is invoked with three arguments: the element value, the
     * element key, and the associated Map instance.
     *
     * @param callback The function to execute for each map entry,
     * @param context The value to use for `this` for each execution of the calback
     */
    forEach(callback, context) {
        const entries = this.entries();
        for (const value of entries) {
            callback.call(context, value[1], value[0], this);
        }
    }
    /**
     * Deletes all keys and their associated values.
     */
    clear() {
        this._map.clear();
    }
    [Symbol.iterator]() {
        return this.entries();
    }
}
export default MultiMap;
//# sourceMappingURL=MultiMap.mjs.map