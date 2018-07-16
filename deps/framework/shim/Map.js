(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./iterator", "./global", "./object", "./support/has", "./Symbol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var iterator_1 = require("./iterator");
    var global_1 = require("./global");
    var object_1 = require("./object");
    var has_1 = require("./support/has");
    require("./Symbol");
    exports.Map = global_1.default.Map;
    if (!has_1.default('es6-map')) {
        exports.Map = (_a = /** @class */ (function () {
                function Map(iterable) {
                    this._keys = [];
                    this._values = [];
                    this[Symbol.toStringTag] = 'Map';
                    if (iterable) {
                        if (iterator_1.isArrayLike(iterable)) {
                            for (var i = 0; i < iterable.length; i++) {
                                var value = iterable[i];
                                this.set(value[0], value[1]);
                            }
                        }
                        else {
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
                 * An alternative to Array.prototype.indexOf using Object.is
                 * to check for equality. See http://mzl.la/1zuKO2V
                 */
                Map.prototype._indexOfKey = function (keys, key) {
                    for (var i = 0, length_1 = keys.length; i < length_1; i++) {
                        if (object_1.is(keys[i], key)) {
                            return i;
                        }
                    }
                    return -1;
                };
                Object.defineProperty(Map.prototype, "size", {
                    get: function () {
                        return this._keys.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.clear = function () {
                    this._keys.length = this._values.length = 0;
                };
                Map.prototype.delete = function (key) {
                    var index = this._indexOfKey(this._keys, key);
                    if (index < 0) {
                        return false;
                    }
                    this._keys.splice(index, 1);
                    this._values.splice(index, 1);
                    return true;
                };
                Map.prototype.entries = function () {
                    var _this = this;
                    var values = this._keys.map(function (key, i) {
                        return [key, _this._values[i]];
                    });
                    return new iterator_1.ShimIterator(values);
                };
                Map.prototype.forEach = function (callback, context) {
                    var keys = this._keys;
                    var values = this._values;
                    for (var i = 0, length_2 = keys.length; i < length_2; i++) {
                        callback.call(context, values[i], keys[i], this);
                    }
                };
                Map.prototype.get = function (key) {
                    var index = this._indexOfKey(this._keys, key);
                    return index < 0 ? undefined : this._values[index];
                };
                Map.prototype.has = function (key) {
                    return this._indexOfKey(this._keys, key) > -1;
                };
                Map.prototype.keys = function () {
                    return new iterator_1.ShimIterator(this._keys);
                };
                Map.prototype.set = function (key, value) {
                    var index = this._indexOfKey(this._keys, key);
                    index = index < 0 ? this._keys.length : index;
                    this._keys[index] = key;
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.values = function () {
                    return new iterator_1.ShimIterator(this._values);
                };
                Map.prototype[Symbol.iterator] = function () {
                    return this.entries();
                };
                return Map;
            }()),
            _a[Symbol.species] = _a,
            _a);
    }
    exports.default = exports.Map;
    var _a;
});
//# sourceMappingURL=Map.js.map