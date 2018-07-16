(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./global", "./support/has", "./Symbol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var global_1 = require("./global");
    var has_1 = require("./support/has");
    var Symbol_1 = require("./Symbol");
    if (has_1.default('es6-object')) {
        var globalObject = global_1.default.Object;
        exports.assign = globalObject.assign;
        exports.getOwnPropertyDescriptor = globalObject.getOwnPropertyDescriptor;
        exports.getOwnPropertyNames = globalObject.getOwnPropertyNames;
        exports.getOwnPropertySymbols = globalObject.getOwnPropertySymbols;
        exports.is = globalObject.is;
        exports.keys = globalObject.keys;
    }
    else {
        exports.keys = function symbolAwareKeys(o) {
            return Object.keys(o).filter(function (key) { return !Boolean(key.match(/^@@.+/)); });
        };
        exports.assign = function assign(target) {
            var sources = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                sources[_i - 1] = arguments[_i];
            }
            if (target == null) {
                // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var to = Object(target);
            sources.forEach(function (nextSource) {
                if (nextSource) {
                    // Skip over if undefined or null
                    exports.keys(nextSource).forEach(function (nextKey) {
                        to[nextKey] = nextSource[nextKey];
                    });
                }
            });
            return to;
        };
        exports.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(o, prop) {
            if (Symbol_1.isSymbol(prop)) {
                return Object.getOwnPropertyDescriptor(o, prop);
            }
            else {
                return Object.getOwnPropertyDescriptor(o, prop);
            }
        };
        exports.getOwnPropertyNames = function getOwnPropertyNames(o) {
            return Object.getOwnPropertyNames(o).filter(function (key) { return !Boolean(key.match(/^@@.+/)); });
        };
        exports.getOwnPropertySymbols = function getOwnPropertySymbols(o) {
            return Object.getOwnPropertyNames(o)
                .filter(function (key) { return Boolean(key.match(/^@@.+/)); })
                .map(function (key) { return Symbol.for(key.substring(2)); });
        };
        exports.is = function is(value1, value2) {
            if (value1 === value2) {
                return value1 !== 0 || 1 / value1 === 1 / value2; // -0
            }
            return value1 !== value1 && value2 !== value2; // NaN
        };
    }
    if (has_1.default('es2017-object')) {
        var globalObject = global_1.default.Object;
        exports.getOwnPropertyDescriptors = globalObject.getOwnPropertyDescriptors;
        exports.entries = globalObject.entries;
        exports.values = globalObject.values;
    }
    else {
        exports.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(o) {
            return exports.getOwnPropertyNames(o).reduce(function (previous, key) {
                previous[key] = exports.getOwnPropertyDescriptor(o, key);
                return previous;
            }, {});
        };
        exports.entries = function entries(o) {
            return exports.keys(o).map(function (key) { return [key, o[key]]; });
        };
        exports.values = function values(o) {
            return exports.keys(o).map(function (key) { return o[key]; });
        };
    }
});
//# sourceMappingURL=object.js.map