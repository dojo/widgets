(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../shim/Map", "../shim/WeakMap", "../shim/Symbol", "./List"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Map_1 = require("../shim/Map");
    var WeakMap_1 = require("../shim/WeakMap");
    require("../shim/Symbol");
    var List_1 = require("./List");
    var noop = function () { };
    var privateStateMap = new WeakMap_1.default();
    function getState(instance) {
        return privateStateMap.get(instance);
    }
    /**
     * A registry of values, mapped by identities.
     */
    var IdentityRegistry = /** @class */ (function () {
        function IdentityRegistry() {
            privateStateMap.set(this, {
                entryMap: new Map_1.default(),
                idMap: new WeakMap_1.default()
            });
        }
        /**
         * Look up a value by its identifier.
         *
         * Throws if no value has been registered for the given identifier.
         *
         * @param id The identifier
         * @return The value
         */
        IdentityRegistry.prototype.get = function (id) {
            var entry = getState(this).entryMap.get(id);
            if (!entry) {
                throw new Error("Could not find a value for identity '" + id.toString() + "'");
            }
            return entry.value;
        };
        /**
         * Determine whether the value has been registered.
         * @param value The value
         * @return `true` if the value has been registered, `false` otherwise
         */
        IdentityRegistry.prototype.contains = function (value) {
            return getState(this).idMap.has(value);
        };
        /**
         * Remove from the registry the value for a given identifier.
         * @param id The identifier
         * @return `true` if the value was removed, `false` otherwise
         */
        IdentityRegistry.prototype.delete = function (id) {
            var entry = getState(this).entryMap.get(id);
            if (!entry) {
                return false;
            }
            entry.handle.destroy();
            return true;
        };
        /**
         * Determine whether a value has been registered for the given identifier.
         * @param id The identifier
         * @return `true` if a value has been registered, `false` otherwise
         */
        IdentityRegistry.prototype.has = function (id) {
            return getState(this).entryMap.has(id);
        };
        /**
         * Look up the identifier for which the given value has been registered.
         *
         * Throws if the value hasn't been registered.
         *
         * @param value The value
         * @return The identifier otherwise
         */
        IdentityRegistry.prototype.identify = function (value) {
            if (!this.contains(value)) {
                throw new Error('Could not identify non-registered value');
            }
            return getState(this).idMap.get(value);
        };
        /**
         * Register a new value with a new identity.
         *
         * Throws if a different value has already been registered for the given identity,
         * or if the value has already been registered with a different identity.
         *
         * @param id The identifier
         * @param value The value
         * @return A handle for deregistering the value. Note that when called repeatedly with
         *   the same identifier and value combination, the same handle is returned
         */
        IdentityRegistry.prototype.register = function (id, value) {
            var _this = this;
            var entryMap = getState(this).entryMap;
            var existingEntry = entryMap.get(id);
            if (existingEntry && existingEntry.value !== value) {
                var str = id.toString();
                throw new Error("A value has already been registered for the given identity (" + str + ")");
            }
            var existingId = this.contains(value) ? this.identify(value) : null;
            if (existingId && existingId !== id) {
                var str = existingId.toString();
                throw new Error("The value has already been registered with a different identity (" + str + ")");
            }
            // Adding the same value with the same id is a noop, return the original handle.
            if (existingEntry && existingId) {
                return existingEntry.handle;
            }
            var handle = {
                destroy: function () {
                    handle.destroy = noop;
                    getState(_this).entryMap.delete(id);
                }
            };
            entryMap.set(id, { handle: handle, value: value });
            getState(this).idMap.set(value, id);
            return handle;
        };
        IdentityRegistry.prototype.entries = function () {
            var values = new List_1.default();
            getState(this).entryMap.forEach(function (value, key) {
                values.add([key, value.value]);
            });
            return values.values();
        };
        IdentityRegistry.prototype.values = function () {
            var values = new List_1.default();
            getState(this).entryMap.forEach(function (value, key) {
                values.add(value.value);
            });
            return values.values();
        };
        IdentityRegistry.prototype.ids = function () {
            return getState(this).entryMap.keys();
        };
        IdentityRegistry.prototype[Symbol.iterator] = function () {
            return this.entries();
        };
        return IdentityRegistry;
    }());
    exports.IdentityRegistry = IdentityRegistry;
    exports.default = IdentityRegistry;
});
//# sourceMappingURL=IdentityRegistry.js.map