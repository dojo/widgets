(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/array", "../shim/iterator", "../shim/Map", "../shim/Symbol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var array_1 = require("../shim/array");
    var iterator_1 = require("../shim/iterator");
    var Map_1 = require("../shim/Map");
    require("../shim/Symbol");
    /**
     * A map implmentation that supports multiple keys for specific value.
     *
     * @param T Accepts the type of the value
     */
    var MultiMap = /** @class */ (function () {
        /**
         * @constructor
         *
         * @param iterator an array or iterator of tuples to initialize the map with.
         */
        function MultiMap(iterable) {
            this[Symbol.toStringTag] = 'MultiMap';
            this._map = new Map_1.default();
            this._key = Symbol();
            if (iterable) {
                if (iterator_1.isArrayLike(iterable)) {
                    for (var i = 0; i < iterable.length; i++) {
                        var value = iterable[i];
                        this.set(value[0], value[1]);
                    }
                }
                else if (iterator_1.isIterable(iterable)) {
                    try {
                        for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                            var value = iterable_1_1.value;
                            this.set(value[0], value[1]);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            var e_1, _a;
        }
        /**
         * Sets the value for the array of keys provided
         *
         * @param keys The array of keys to store the value against
         * @param value the value of the map entry
         *
         * @return the multi map instance
         */
        MultiMap.prototype.set = function (keys, value) {
            var map = this._map;
            var childMap;
            for (var i = 0; i < keys.length; i++) {
                if (map.get(keys[i])) {
                    map = map.get(keys[i]);
                    continue;
                }
                childMap = new Map_1.default();
                map.set(keys[i], childMap);
                map = childMap;
            }
            map.set(this._key, value);
            return this;
        };
        /**
         * Returns the value entry for the array of keys
         *
         * @param keys The array of keys to look up the value for
         *
         * @return The value if found otherwise `undefined`
         */
        MultiMap.prototype.get = function (keys) {
            var map = this._map;
            for (var i = 0; i < keys.length; i++) {
                map = map.get(keys[i]);
                if (!map) {
                    return undefined;
                }
            }
            return map.get(this._key);
        };
        /**
         * Returns a boolean indicating if the key exists in the map
         *
         * @return boolean true if the key exists otherwise false
         */
        MultiMap.prototype.has = function (keys) {
            var map = this._map;
            for (var i = 0; i < keys.length; i++) {
                map = map.get(keys[i]);
                if (!map) {
                    return false;
                }
            }
            return true;
        };
        Object.defineProperty(MultiMap.prototype, "size", {
            /**
             * Returns the size of the map, based on the number of unique keys
             */
            get: function () {
                return array_1.from(this.keys()).length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Deletes the entry for the key provided.
         *
         * @param keys the key of the entry to remove
         * @return boolean trus if the entry was deleted, false if the entry was not found
         */
        MultiMap.prototype.delete = function (keys) {
            var map = this._map;
            var path = [this._map];
            for (var i = 0; i < keys.length; i++) {
                map = map.get(keys[i]);
                path.push(map);
                if (!map) {
                    return false;
                }
            }
            map.delete(this._key);
            for (var i = keys.length - 1; i >= 0; i--) {
                map = path[i].get(keys[i]);
                if (map.size) {
                    break;
                }
                path[i].delete(keys[i]);
            }
            return true;
        };
        /**
         * Return an iterator that yields each value in the map
         *
         * @return An iterator containing the instance's values.
         */
        MultiMap.prototype.values = function () {
            var _this = this;
            var values = [];
            var getValues = function (map) {
                map.forEach(function (value, key) {
                    if (key === _this._key) {
                        values.push(value);
                    }
                    else {
                        getValues(value);
                    }
                });
            };
            getValues(this._map);
            return new iterator_1.ShimIterator(values);
        };
        /**
         * Return an iterator that yields each key array in the map
         *
         * @return An iterator containing the instance's keys.
         */
        MultiMap.prototype.keys = function () {
            var _this = this;
            var finalKeys = [];
            var getKeys = function (map, keys) {
                if (keys === void 0) { keys = []; }
                map.forEach(function (value, key) {
                    if (key === _this._key) {
                        finalKeys.push(keys);
                    }
                    else {
                        var nextKeys = tslib_1.__spread(keys, [key]);
                        getKeys(value, nextKeys);
                    }
                });
            };
            getKeys(this._map);
            return new iterator_1.ShimIterator(finalKeys);
        };
        /**
         * Returns an iterator that yields each key/value pair as an array.
         *
         * @return An iterator for each key/value pair in the instance.
         */
        MultiMap.prototype.entries = function () {
            var _this = this;
            var finalEntries = [];
            var getKeys = function (map, keys) {
                if (keys === void 0) { keys = []; }
                map.forEach(function (value, key) {
                    if (key === _this._key) {
                        finalEntries.push([keys, value]);
                    }
                    else {
                        var nextKeys = tslib_1.__spread(keys, [key]);
                        getKeys(value, nextKeys);
                    }
                });
            };
            getKeys(this._map);
            return new iterator_1.ShimIterator(finalEntries);
        };
        /**
         * Executes a given function for each map entry. The function
         * is invoked with three arguments: the element value, the
         * element key, and the associated Map instance.
         *
         * @param callback The function to execute for each map entry,
         * @param context The value to use for `this` for each execution of the calback
         */
        MultiMap.prototype.forEach = function (callback, context) {
            var entries = this.entries();
            try {
                for (var entries_1 = tslib_1.__values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                    var value = entries_1_1.value;
                    callback.call(context, value[1], value[0], this);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var e_2, _a;
        };
        /**
         * Deletes all keys and their associated values.
         */
        MultiMap.prototype.clear = function () {
            this._map.clear();
        };
        MultiMap.prototype[Symbol.iterator] = function () {
            return this.entries();
        };
        return MultiMap;
    }());
    exports.MultiMap = MultiMap;
    exports.default = MultiMap;
});
//# sourceMappingURL=MultiMap.js.map