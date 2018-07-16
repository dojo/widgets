(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./global", "./iterator", "./number", "./support/has", "./support/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var global_1 = require("./global");
    var iterator_1 = require("./iterator");
    var number_1 = require("./number");
    var has_1 = require("./support/has");
    var util_1 = require("./support/util");
    if (has_1.default('es6-array') && has_1.default('es6-array-fill')) {
        exports.from = global_1.default.Array.from;
        exports.of = global_1.default.Array.of;
        exports.copyWithin = util_1.wrapNative(global_1.default.Array.prototype.copyWithin);
        exports.fill = util_1.wrapNative(global_1.default.Array.prototype.fill);
        exports.find = util_1.wrapNative(global_1.default.Array.prototype.find);
        exports.findIndex = util_1.wrapNative(global_1.default.Array.prototype.findIndex);
    }
    else {
        // It is only older versions of Safari/iOS that have a bad fill implementation and so aren't in the wild
        // To make things easier, if there is a bad fill implementation, the whole set of functions will be filled
        /**
         * Ensures a non-negative, non-infinite, safe integer.
         *
         * @param length The number to validate
         * @return A proper length
         */
        var toLength_1 = function toLength(length) {
            if (isNaN(length)) {
                return 0;
            }
            length = Number(length);
            if (isFinite(length)) {
                length = Math.floor(length);
            }
            // Ensure a non-negative, real, safe integer
            return Math.min(Math.max(length, 0), number_1.MAX_SAFE_INTEGER);
        };
        /**
         * From ES6 7.1.4 ToInteger()
         *
         * @param value A value to convert
         * @return An integer
         */
        var toInteger_1 = function toInteger(value) {
            value = Number(value);
            if (isNaN(value)) {
                return 0;
            }
            if (value === 0 || !isFinite(value)) {
                return value;
            }
            return (value > 0 ? 1 : -1) * Math.floor(Math.abs(value));
        };
        /**
         * Normalizes an offset against a given length, wrapping it if negative.
         *
         * @param value The original offset
         * @param length The total length to normalize against
         * @return If negative, provide a distance from the end (length); otherwise provide a distance from 0
         */
        var normalizeOffset_1 = function normalizeOffset(value, length) {
            return value < 0 ? Math.max(length + value, 0) : Math.min(value, length);
        };
        exports.from = function from(arrayLike, mapFunction, thisArg) {
            if (arrayLike == null) {
                throw new TypeError('from: requires an array-like object');
            }
            if (mapFunction && thisArg) {
                mapFunction = mapFunction.bind(thisArg);
            }
            /* tslint:disable-next-line:variable-name */
            var Constructor = this;
            var length = toLength_1(arrayLike.length);
            // Support extension
            var array = typeof Constructor === 'function' ? Object(new Constructor(length)) : new Array(length);
            if (!iterator_1.isArrayLike(arrayLike) && !iterator_1.isIterable(arrayLike)) {
                return array;
            }
            // if this is an array and the normalized length is 0, just return an empty array. this prevents a problem
            // with the iteration on IE when using a NaN array length.
            if (iterator_1.isArrayLike(arrayLike)) {
                if (length === 0) {
                    return [];
                }
                for (var i = 0; i < arrayLike.length; i++) {
                    array[i] = mapFunction ? mapFunction(arrayLike[i], i) : arrayLike[i];
                }
            }
            else {
                var i = 0;
                try {
                    for (var arrayLike_1 = tslib_1.__values(arrayLike), arrayLike_1_1 = arrayLike_1.next(); !arrayLike_1_1.done; arrayLike_1_1 = arrayLike_1.next()) {
                        var value = arrayLike_1_1.value;
                        array[i] = mapFunction ? mapFunction(value, i) : value;
                        i++;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (arrayLike_1_1 && !arrayLike_1_1.done && (_a = arrayLike_1.return)) _a.call(arrayLike_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            if (arrayLike.length !== undefined) {
                array.length = length;
            }
            return array;
            var e_1, _a;
        };
        exports.of = function of() {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            return Array.prototype.slice.call(items);
        };
        exports.copyWithin = function copyWithin(target, offset, start, end) {
            if (target == null) {
                throw new TypeError('copyWithin: target must be an array-like object');
            }
            var length = toLength_1(target.length);
            offset = normalizeOffset_1(toInteger_1(offset), length);
            start = normalizeOffset_1(toInteger_1(start), length);
            end = normalizeOffset_1(end === undefined ? length : toInteger_1(end), length);
            var count = Math.min(end - start, length - offset);
            var direction = 1;
            if (offset > start && offset < start + count) {
                direction = -1;
                start += count - 1;
                offset += count - 1;
            }
            while (count > 0) {
                if (start in target) {
                    target[offset] = target[start];
                }
                else {
                    delete target[offset];
                }
                offset += direction;
                start += direction;
                count--;
            }
            return target;
        };
        exports.fill = function fill(target, value, start, end) {
            var length = toLength_1(target.length);
            var i = normalizeOffset_1(toInteger_1(start), length);
            end = normalizeOffset_1(end === undefined ? length : toInteger_1(end), length);
            while (i < end) {
                target[i++] = value;
            }
            return target;
        };
        exports.find = function find(target, callback, thisArg) {
            var index = exports.findIndex(target, callback, thisArg);
            return index !== -1 ? target[index] : undefined;
        };
        exports.findIndex = function findIndex(target, callback, thisArg) {
            var length = toLength_1(target.length);
            if (!callback) {
                throw new TypeError('find: second argument must be a function');
            }
            if (thisArg) {
                callback = callback.bind(thisArg);
            }
            for (var i = 0; i < length; i++) {
                if (callback(target[i], i, target)) {
                    return i;
                }
            }
            return -1;
        };
    }
    if (has_1.default('es7-array')) {
        exports.includes = util_1.wrapNative(global_1.default.Array.prototype.includes);
    }
    else {
        /**
         * Ensures a non-negative, non-infinite, safe integer.
         *
         * @param length The number to validate
         * @return A proper length
         */
        var toLength_2 = function toLength(length) {
            length = Number(length);
            if (isNaN(length)) {
                return 0;
            }
            if (isFinite(length)) {
                length = Math.floor(length);
            }
            // Ensure a non-negative, real, safe integer
            return Math.min(Math.max(length, 0), number_1.MAX_SAFE_INTEGER);
        };
        exports.includes = function includes(target, searchElement, fromIndex) {
            if (fromIndex === void 0) { fromIndex = 0; }
            var len = toLength_2(target.length);
            for (var i = fromIndex; i < len; ++i) {
                var currentElement = target[i];
                if (searchElement === currentElement ||
                    (searchElement !== searchElement && currentElement !== currentElement)) {
                    return true;
                }
            }
            return false;
        };
    }
});
//# sourceMappingURL=array.js.map