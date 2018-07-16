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
    exports.Set = global_1.default.Set;
    if (!has_1.default('es6-set')) {
        exports.Set = (_a = /** @class */ (function () {
                function Set(iterable) {
                    this._setData = [];
                    this[Symbol.toStringTag] = 'Set';
                    if (iterable) {
                        if (iterator_1.isArrayLike(iterable)) {
                            for (var i = 0; i < iterable.length; i++) {
                                this.add(iterable[i]);
                            }
                        }
                        else {
                            try {
                                for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                                    var value = iterable_1_1.value;
                                    this.add(value);
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
                Set.prototype.add = function (value) {
                    if (this.has(value)) {
                        return this;
                    }
                    this._setData.push(value);
                    return this;
                };
                Set.prototype.clear = function () {
                    this._setData.length = 0;
                };
                Set.prototype.delete = function (value) {
                    var idx = this._setData.indexOf(value);
                    if (idx === -1) {
                        return false;
                    }
                    this._setData.splice(idx, 1);
                    return true;
                };
                Set.prototype.entries = function () {
                    return new iterator_1.ShimIterator(this._setData.map(function (value) { return [value, value]; }));
                };
                Set.prototype.forEach = function (callbackfn, thisArg) {
                    var iterator = this.values();
                    var result = iterator.next();
                    while (!result.done) {
                        callbackfn.call(thisArg, result.value, result.value, this);
                        result = iterator.next();
                    }
                };
                Set.prototype.has = function (value) {
                    return this._setData.indexOf(value) > -1;
                };
                Set.prototype.keys = function () {
                    return new iterator_1.ShimIterator(this._setData);
                };
                Object.defineProperty(Set.prototype, "size", {
                    get: function () {
                        return this._setData.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.values = function () {
                    return new iterator_1.ShimIterator(this._setData);
                };
                Set.prototype[Symbol.iterator] = function () {
                    return new iterator_1.ShimIterator(this._setData);
                };
                return Set;
            }()),
            _a[Symbol.species] = _a,
            _a);
    }
    exports.default = exports.Set;
    var _a;
});
//# sourceMappingURL=Set.js.map