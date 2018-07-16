(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./global", "./iterator", "./support/has", "./Symbol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var global_1 = require("./global");
    var iterator_1 = require("./iterator");
    var has_1 = require("./support/has");
    require("./Symbol");
    exports.WeakMap = global_1.default.WeakMap;
    if (!has_1.default('es6-weakmap')) {
        var DELETED_1 = {};
        var getUID_1 = function getUID() {
            return Math.floor(Math.random() * 100000000);
        };
        var generateName_1 = (function () {
            var startId = Math.floor(Date.now() % 100000000);
            return function generateName() {
                return '__wm' + getUID_1() + (startId++ + '__');
            };
        })();
        exports.WeakMap = /** @class */ (function () {
            function WeakMap(iterable) {
                this[Symbol.toStringTag] = 'WeakMap';
                this._name = generateName_1();
                this._frozenEntries = [];
                if (iterable) {
                    if (iterator_1.isArrayLike(iterable)) {
                        for (var i = 0; i < iterable.length; i++) {
                            var item = iterable[i];
                            this.set(item[0], item[1]);
                        }
                    }
                    else {
                        try {
                            for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                                var _a = tslib_1.__read(iterable_1_1.value, 2), key = _a[0], value = _a[1];
                                this.set(key, value);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (iterable_1_1 && !iterable_1_1.done && (_b = iterable_1.return)) _b.call(iterable_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                }
                var e_1, _b;
            }
            WeakMap.prototype._getFrozenEntryIndex = function (key) {
                for (var i = 0; i < this._frozenEntries.length; i++) {
                    if (this._frozenEntries[i].key === key) {
                        return i;
                    }
                }
                return -1;
            };
            WeakMap.prototype.delete = function (key) {
                if (key === undefined || key === null) {
                    return false;
                }
                var entry = key[this._name];
                if (entry && entry.key === key && entry.value !== DELETED_1) {
                    entry.value = DELETED_1;
                    return true;
                }
                var frozenIndex = this._getFrozenEntryIndex(key);
                if (frozenIndex >= 0) {
                    this._frozenEntries.splice(frozenIndex, 1);
                    return true;
                }
                return false;
            };
            WeakMap.prototype.get = function (key) {
                if (key === undefined || key === null) {
                    return undefined;
                }
                var entry = key[this._name];
                if (entry && entry.key === key && entry.value !== DELETED_1) {
                    return entry.value;
                }
                var frozenIndex = this._getFrozenEntryIndex(key);
                if (frozenIndex >= 0) {
                    return this._frozenEntries[frozenIndex].value;
                }
            };
            WeakMap.prototype.has = function (key) {
                if (key === undefined || key === null) {
                    return false;
                }
                var entry = key[this._name];
                if (Boolean(entry && entry.key === key && entry.value !== DELETED_1)) {
                    return true;
                }
                var frozenIndex = this._getFrozenEntryIndex(key);
                if (frozenIndex >= 0) {
                    return true;
                }
                return false;
            };
            WeakMap.prototype.set = function (key, value) {
                if (!key || (typeof key !== 'object' && typeof key !== 'function')) {
                    throw new TypeError('Invalid value used as weak map key');
                }
                var entry = key[this._name];
                if (!entry || entry.key !== key) {
                    entry = Object.create(null, {
                        key: { value: key }
                    });
                    if (Object.isFrozen(key)) {
                        this._frozenEntries.push(entry);
                    }
                    else {
                        Object.defineProperty(key, this._name, {
                            value: entry
                        });
                    }
                }
                entry.value = value;
                return this;
            };
            return WeakMap;
        }());
    }
    exports.default = exports.WeakMap;
});
//# sourceMappingURL=WeakMap.js.map