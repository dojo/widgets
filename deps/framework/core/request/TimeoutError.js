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
    var TimeoutError = /** @class */ (function () {
        function TimeoutError(message) {
            message = message || 'The request timed out';
            this.message = message;
        }
        Object.defineProperty(TimeoutError.prototype, "name", {
            get: function () {
                return 'TimeoutError';
            },
            enumerable: true,
            configurable: true
        });
        return TimeoutError;
    }());
    exports.TimeoutError = TimeoutError;
    exports.default = TimeoutError;
});
//# sourceMappingURL=TimeoutError.js.map