(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Symbol", "./string"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("./Symbol");
    var string_1 = require("./string");
    var staticDone = { done: true, value: undefined };
    /**
     * A class that _shims_ an iterator interface on array like objects.
     */
    var ShimIterator = /** @class */ (function () {
        function ShimIterator(list) {
            this._nextIndex = -1;
            if (isIterable(list)) {
                this._nativeIterator = list[Symbol.iterator]();
            }
            else {
                this._list = list;
            }
        }
        /**
         * Return the next iteration result for the Iterator
         */
        ShimIterator.prototype.next = function () {
            if (this._nativeIterator) {
                return this._nativeIterator.next();
            }
            if (!this._list) {
                return staticDone;
            }
            if (++this._nextIndex < this._list.length) {
                return {
                    done: false,
                    value: this._list[this._nextIndex]
                };
            }
            return staticDone;
        };
        ShimIterator.prototype[Symbol.iterator] = function () {
            return this;
        };
        return ShimIterator;
    }());
    exports.ShimIterator = ShimIterator;
    /**
     * A type guard for checking if something has an Iterable interface
     *
     * @param value The value to type guard against
     */
    function isIterable(value) {
        return value && typeof value[Symbol.iterator] === 'function';
    }
    exports.isIterable = isIterable;
    /**
     * A type guard for checking if something is ArrayLike
     *
     * @param value The value to type guard against
     */
    function isArrayLike(value) {
        return value && typeof value.length === 'number';
    }
    exports.isArrayLike = isArrayLike;
    /**
     * Returns the iterator for an object
     *
     * @param iterable The iterable object to return the iterator for
     */
    function get(iterable) {
        if (isIterable(iterable)) {
            return iterable[Symbol.iterator]();
        }
        else if (isArrayLike(iterable)) {
            return new ShimIterator(iterable);
        }
    }
    exports.get = get;
    /**
     * Shims the functionality of `for ... of` blocks
     *
     * @param iterable The object the provides an interator interface
     * @param callback The callback which will be called for each item of the iterable
     * @param thisArg Optional scope to pass the callback
     */
    function forOf(iterable, callback, thisArg) {
        var broken = false;
        function doBreak() {
            broken = true;
        }
        /* We need to handle iteration of double byte strings properly */
        if (isArrayLike(iterable) && typeof iterable === 'string') {
            var l = iterable.length;
            for (var i = 0; i < l; ++i) {
                var char = iterable[i];
                if (i + 1 < l) {
                    var code = char.charCodeAt(0);
                    if (code >= string_1.HIGH_SURROGATE_MIN && code <= string_1.HIGH_SURROGATE_MAX) {
                        char += iterable[++i];
                    }
                }
                callback.call(thisArg, char, iterable, doBreak);
                if (broken) {
                    return;
                }
            }
        }
        else {
            var iterator = get(iterable);
            if (iterator) {
                var result = iterator.next();
                while (!result.done) {
                    callback.call(thisArg, result.value, iterable, doBreak);
                    if (broken) {
                        return;
                    }
                    result = iterator.next();
                }
            }
        }
    }
    exports.forOf = forOf;
});
//# sourceMappingURL=iterator.js.map