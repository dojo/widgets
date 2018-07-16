(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./global", "./support/has", "./support/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var global_1 = require("./global");
    var has_1 = require("./support/has");
    var util_1 = require("./support/util");
    /**
     * The minimum location of high surrogates
     */
    exports.HIGH_SURROGATE_MIN = 0xd800;
    /**
     * The maximum location of high surrogates
     */
    exports.HIGH_SURROGATE_MAX = 0xdbff;
    /**
     * The minimum location of low surrogates
     */
    exports.LOW_SURROGATE_MIN = 0xdc00;
    /**
     * The maximum location of low surrogates
     */
    exports.LOW_SURROGATE_MAX = 0xdfff;
    if (has_1.default('es6-string') && has_1.default('es6-string-raw')) {
        exports.fromCodePoint = global_1.default.String.fromCodePoint;
        exports.raw = global_1.default.String.raw;
        exports.codePointAt = util_1.wrapNative(global_1.default.String.prototype.codePointAt);
        exports.endsWith = util_1.wrapNative(global_1.default.String.prototype.endsWith);
        exports.includes = util_1.wrapNative(global_1.default.String.prototype.includes);
        exports.normalize = util_1.wrapNative(global_1.default.String.prototype.normalize);
        exports.repeat = util_1.wrapNative(global_1.default.String.prototype.repeat);
        exports.startsWith = util_1.wrapNative(global_1.default.String.prototype.startsWith);
    }
    else {
        /**
         * Validates that text is defined, and normalizes position (based on the given default if the input is NaN).
         * Used by startsWith, includes, and endsWith.
         *
         * @return Normalized position.
         */
        var normalizeSubstringArgs_1 = function (name, text, search, position, isEnd) {
            if (isEnd === void 0) { isEnd = false; }
            if (text == null) {
                throw new TypeError('string.' + name + ' requires a valid string to search against.');
            }
            var length = text.length;
            position = position !== position ? (isEnd ? length : 0) : position;
            return [text, String(search), Math.min(Math.max(position, 0), length)];
        };
        exports.fromCodePoint = function fromCodePoint() {
            var codePoints = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                codePoints[_i] = arguments[_i];
            }
            // Adapted from https://github.com/mathiasbynens/String.fromCodePoint
            var length = arguments.length;
            if (!length) {
                return '';
            }
            var fromCharCode = String.fromCharCode;
            var MAX_SIZE = 0x4000;
            var codeUnits = [];
            var index = -1;
            var result = '';
            while (++index < length) {
                var codePoint = Number(arguments[index]);
                // Code points must be finite integers within the valid range
                var isValid = isFinite(codePoint) && Math.floor(codePoint) === codePoint && codePoint >= 0 && codePoint <= 0x10ffff;
                if (!isValid) {
                    throw RangeError('string.fromCodePoint: Invalid code point ' + codePoint);
                }
                if (codePoint <= 0xffff) {
                    // BMP code point
                    codeUnits.push(codePoint);
                }
                else {
                    // Astral code point; split in surrogate halves
                    // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                    codePoint -= 0x10000;
                    var highSurrogate = (codePoint >> 10) + exports.HIGH_SURROGATE_MIN;
                    var lowSurrogate = codePoint % 0x400 + exports.LOW_SURROGATE_MIN;
                    codeUnits.push(highSurrogate, lowSurrogate);
                }
                if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                    result += fromCharCode.apply(null, codeUnits);
                    codeUnits.length = 0;
                }
            }
            return result;
        };
        exports.raw = function raw(callSite) {
            var substitutions = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                substitutions[_i - 1] = arguments[_i];
            }
            var rawStrings = callSite.raw;
            var result = '';
            var numSubstitutions = substitutions.length;
            if (callSite == null || callSite.raw == null) {
                throw new TypeError('string.raw requires a valid callSite object with a raw value');
            }
            for (var i = 0, length_1 = rawStrings.length; i < length_1; i++) {
                result += rawStrings[i] + (i < numSubstitutions && i < length_1 - 1 ? substitutions[i] : '');
            }
            return result;
        };
        exports.codePointAt = function codePointAt(text, position) {
            if (position === void 0) { position = 0; }
            // Adapted from https://github.com/mathiasbynens/String.prototype.codePointAt
            if (text == null) {
                throw new TypeError('string.codePointAt requries a valid string.');
            }
            var length = text.length;
            if (position !== position) {
                position = 0;
            }
            if (position < 0 || position >= length) {
                return undefined;
            }
            // Get the first code unit
            var first = text.charCodeAt(position);
            if (first >= exports.HIGH_SURROGATE_MIN && first <= exports.HIGH_SURROGATE_MAX && length > position + 1) {
                // Start of a surrogate pair (high surrogate and there is a next code unit); check for low surrogate
                // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                var second = text.charCodeAt(position + 1);
                if (second >= exports.LOW_SURROGATE_MIN && second <= exports.LOW_SURROGATE_MAX) {
                    return (first - exports.HIGH_SURROGATE_MIN) * 0x400 + second - exports.LOW_SURROGATE_MIN + 0x10000;
                }
            }
            return first;
        };
        exports.endsWith = function endsWith(text, search, endPosition) {
            if (endPosition == null) {
                endPosition = text.length;
            }
            _a = tslib_1.__read(normalizeSubstringArgs_1('endsWith', text, search, endPosition, true), 3), text = _a[0], search = _a[1], endPosition = _a[2];
            var start = endPosition - search.length;
            if (start < 0) {
                return false;
            }
            return text.slice(start, endPosition) === search;
            var _a;
        };
        exports.includes = function includes(text, search, position) {
            if (position === void 0) { position = 0; }
            _a = tslib_1.__read(normalizeSubstringArgs_1('includes', text, search, position), 3), text = _a[0], search = _a[1], position = _a[2];
            return text.indexOf(search, position) !== -1;
            var _a;
        };
        exports.repeat = function repeat(text, count) {
            if (count === void 0) { count = 0; }
            // Adapted from https://github.com/mathiasbynens/String.prototype.repeat
            if (text == null) {
                throw new TypeError('string.repeat requires a valid string.');
            }
            if (count !== count) {
                count = 0;
            }
            if (count < 0 || count === Infinity) {
                throw new RangeError('string.repeat requires a non-negative finite count.');
            }
            var result = '';
            while (count) {
                if (count % 2) {
                    result += text;
                }
                if (count > 1) {
                    text += text;
                }
                count >>= 1;
            }
            return result;
        };
        exports.startsWith = function startsWith(text, search, position) {
            if (position === void 0) { position = 0; }
            search = String(search);
            _a = tslib_1.__read(normalizeSubstringArgs_1('startsWith', text, search, position), 3), text = _a[0], search = _a[1], position = _a[2];
            var end = position + search.length;
            if (end > text.length) {
                return false;
            }
            return text.slice(position, end) === search;
            var _a;
        };
    }
    if (has_1.default('es2017-string')) {
        exports.padEnd = util_1.wrapNative(global_1.default.String.prototype.padEnd);
        exports.padStart = util_1.wrapNative(global_1.default.String.prototype.padStart);
    }
    else {
        exports.padEnd = function padEnd(text, maxLength, fillString) {
            if (fillString === void 0) { fillString = ' '; }
            if (text === null || text === undefined) {
                throw new TypeError('string.repeat requires a valid string.');
            }
            if (maxLength === Infinity) {
                throw new RangeError('string.padEnd requires a non-negative finite count.');
            }
            if (maxLength === null || maxLength === undefined || maxLength < 0) {
                maxLength = 0;
            }
            var strText = String(text);
            var padding = maxLength - strText.length;
            if (padding > 0) {
                strText +=
                    exports.repeat(fillString, Math.floor(padding / fillString.length)) +
                        fillString.slice(0, padding % fillString.length);
            }
            return strText;
        };
        exports.padStart = function padStart(text, maxLength, fillString) {
            if (fillString === void 0) { fillString = ' '; }
            if (text === null || text === undefined) {
                throw new TypeError('string.repeat requires a valid string.');
            }
            if (maxLength === Infinity) {
                throw new RangeError('string.padStart requires a non-negative finite count.');
            }
            if (maxLength === null || maxLength === undefined || maxLength < 0) {
                maxLength = 0;
            }
            var strText = String(text);
            var padding = maxLength - strText.length;
            if (padding > 0) {
                strText =
                    exports.repeat(fillString, Math.floor(padding / fillString.length)) +
                        fillString.slice(0, padding % fillString.length) +
                        strText;
            }
            return strText;
        };
    }
});
//# sourceMappingURL=string.js.map