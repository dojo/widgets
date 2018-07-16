(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A registry of values tagged with matchers.
     */
    var MatchRegistry = /** @class */ (function () {
        /**
         * Construct a new MatchRegistry, optionally containing a given default value.
         */
        function MatchRegistry(defaultValue) {
            this._defaultValue = defaultValue;
            this._entries = [];
        }
        /**
         * Return the first entry in this registry that matches the given arguments. If no entry matches and the registry
         * was created with a default value, that value will be returned. Otherwise, an exception is thrown.
         *
         * @param ...args Arguments that will be used to select a matching value.
         * @returns the matching value, or a default value if one exists.
         */
        MatchRegistry.prototype.match = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var entries = this._entries ? this._entries.slice(0) : [];
            var entry;
            for (var i = 0; (entry = entries[i]); ++i) {
                if (entry.value && entry.test && entry.test.apply(null, args)) {
                    return entry.value;
                }
            }
            if (this._defaultValue !== undefined) {
                return this._defaultValue;
            }
            throw new Error('No match found');
        };
        /**
         * Register a test + value pair with this registry.
         *
         * @param test The test that will be used to determine if the registered value matches a set of arguments.
         * @param value A value being registered.
         * @param first If true, the newly registered test and value will be the first entry in the registry.
         */
        MatchRegistry.prototype.register = function (test, value, first) {
            var entries = this._entries;
            var entry = {
                test: test,
                value: value
            };
            entries[first ? 'unshift' : 'push'](entry);
            return {
                destroy: function () {
                    this.destroy = function () { };
                    var i = 0;
                    if (entries && entry) {
                        while ((i = entries.indexOf(entry, i)) > -1) {
                            entries.splice(i, 1);
                        }
                    }
                    test = value = entries = entry = null;
                }
            };
        };
        return MatchRegistry;
    }());
    exports.MatchRegistry = MatchRegistry;
    exports.default = MatchRegistry;
});
//# sourceMappingURL=MatchRegistry.js.map