(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/iterator", "../shim/WeakMap"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var iterator_1 = require("../shim/iterator");
    var WeakMap_1 = require("../shim/WeakMap");
    var listItems = new WeakMap_1.default();
    function getListItems(list) {
        return (listItems.get(list) || []);
    }
    var List = /** @class */ (function () {
        function List(source) {
            listItems.set(this, []);
            if (source) {
                if (iterator_1.isArrayLike(source)) {
                    for (var i = 0; i < source.length; i++) {
                        this.add(source[i]);
                    }
                }
                else if (iterator_1.isIterable(source)) {
                    try {
                        for (var source_1 = tslib_1.__values(source), source_1_1 = source_1.next(); !source_1_1.done; source_1_1 = source_1.next()) {
                            var item = source_1_1.value;
                            this.add(item);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (source_1_1 && !source_1_1.done && (_a = source_1.return)) _a.call(source_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            var e_1, _a;
        }
        List.prototype[Symbol.iterator] = function () {
            return this.values();
        };
        Object.defineProperty(List.prototype, "size", {
            get: function () {
                return getListItems(this).length;
            },
            enumerable: true,
            configurable: true
        });
        List.prototype.add = function (value) {
            getListItems(this).push(value);
            return this;
        };
        List.prototype.clear = function () {
            listItems.set(this, []);
        };
        List.prototype.delete = function (idx) {
            if (idx < this.size) {
                getListItems(this).splice(idx, 1);
                return true;
            }
            return false;
        };
        List.prototype.entries = function () {
            return new iterator_1.ShimIterator(getListItems(this).map(function (value, index) { return [index, value]; }));
        };
        List.prototype.forEach = function (fn, thisArg) {
            getListItems(this).forEach(fn.bind(thisArg ? thisArg : this));
        };
        List.prototype.has = function (idx) {
            return this.size > idx;
        };
        List.prototype.includes = function (value) {
            return getListItems(this).indexOf(value) >= 0;
        };
        List.prototype.indexOf = function (value) {
            return getListItems(this).indexOf(value);
        };
        List.prototype.join = function (separator) {
            if (separator === void 0) { separator = ','; }
            return getListItems(this).join(separator);
        };
        List.prototype.keys = function () {
            return new iterator_1.ShimIterator(getListItems(this).map(function (_, index) { return index; }));
        };
        List.prototype.lastIndexOf = function (value) {
            return getListItems(this).lastIndexOf(value);
        };
        List.prototype.push = function (value) {
            this.add(value);
        };
        List.prototype.pop = function () {
            return getListItems(this).pop();
        };
        List.prototype.splice = function (start, deleteCount) {
            var newItems = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                newItems[_i - 2] = arguments[_i];
            }
            return (_a = getListItems(this)).splice.apply(_a, tslib_1.__spread([start,
                deleteCount === undefined ? this.size - start : deleteCount], newItems));
            var _a;
        };
        List.prototype.values = function () {
            return new iterator_1.ShimIterator(getListItems(this).map(function (value) { return value; }));
        };
        return List;
    }());
    exports.List = List;
    exports.default = List;
});
//# sourceMappingURL=List.js.map