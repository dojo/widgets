(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./global", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var global_1 = require("./global");
    var tslib = require("tslib");
    /**
     * Provide any overrides and then load the TypeScript helpers.
     */
    tslib.__values = global_1.default.__values = function (o) {
        var m = typeof Symbol === 'function' && o[Symbol.iterator], i = 0;
        if (m) {
            return m.call(o);
        }
        if (typeof o === 'string') {
            var l_1 = o.length;
            return {
                next: function () {
                    if (i >= l_1) {
                        return { done: true };
                    }
                    var char = o[i++];
                    if (i < l_1) {
                        var code = char.charCodeAt(0);
                        if (code >= 0xd800 && code <= 0xdbff) {
                            char += o[i++];
                        }
                    }
                    return { value: char, done: false };
                }
            };
        }
        return {
            next: function () {
                if (o && i >= o.length) {
                    o = void 0;
                }
                return { value: o && o[i++], done: !o };
            }
        };
    };
});
//# sourceMappingURL=tslib.js.map