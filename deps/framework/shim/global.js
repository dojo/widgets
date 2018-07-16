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
    var globalObject = (function () {
        if (typeof global !== 'undefined') {
            // global spec defines a reference to the global object called 'global'
            // https://github.com/tc39/proposal-global
            // `global` is also defined in NodeJS
            return global;
        }
        else if (typeof window !== 'undefined') {
            // window is defined in browsers
            return window;
        }
        else if (typeof self !== 'undefined') {
            // self is defined in WebWorkers
            return self;
        }
    })();
    exports.default = globalObject;
});
//# sourceMappingURL=global.js.map