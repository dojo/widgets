(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./ExtensiblePromise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var ExtensiblePromise_1 = require("./ExtensiblePromise");
    /**
     * Used for delaying a Promise chain for a specific number of milliseconds.
     *
     * @param milliseconds the number of milliseconds to delay
     * @return {function (value: T | (() => T | Thenable<T>)): Promise<T>} a function producing a promise that eventually returns the value or executes the value function passed to it; usable with Thenable.then()
     */
    function delay(milliseconds) {
        return function (value) {
            return new ExtensiblePromise_1.default(function (resolve) {
                setTimeout(function () {
                    resolve(typeof value === 'function' ? value() : value);
                }, milliseconds);
            });
        };
    }
    exports.delay = delay;
    /**
     * Reject a promise chain if a result hasn't been found before the timeout
     *
     * @param milliseconds after this number of milliseconds a rejection will be returned
     * @param reason The reason for the rejection
     * @return {function(T): Promise<T>} a function that produces a promise that is rejected or resolved based on your timeout
     */
    function timeout(milliseconds, reason) {
        var start = Date.now();
        return function (value) {
            if (Date.now() - milliseconds > start) {
                return ExtensiblePromise_1.default.reject(reason);
            }
            if (typeof value === 'function') {
                return ExtensiblePromise_1.default.resolve(value());
            }
            return ExtensiblePromise_1.default.resolve(value);
        };
    }
    exports.timeout = timeout;
    /**
     * A Promise that will reject itself automatically after a time.
     * Useful for combining with other promises in Promise.race.
     */
    var DelayedRejection = /** @class */ (function (_super) {
        tslib_1.__extends(DelayedRejection, _super);
        /**
         * @param milliseconds the number of milliseconds to wait before triggering a rejection
         * @param reason the reason for the rejection
         */
        function DelayedRejection(milliseconds, reason) {
            var _this = _super.call(this, function () { }) || this;
            return new ExtensiblePromise_1.default(function (resolve, reject) {
                setTimeout(function () {
                    reject(reason);
                }, milliseconds);
            });
        }
        return DelayedRejection;
    }(ExtensiblePromise_1.default));
    exports.DelayedRejection = DelayedRejection;
});
//# sourceMappingURL=timing.js.map