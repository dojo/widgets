(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./lang"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var lang_1 = require("./lang");
    /**
     * Wraps a setTimeout call in a handle, allowing the timeout to be cleared by calling destroy.
     *
     * @param callback Callback to be called when the timeout elapses
     * @param delay Number of milliseconds to wait before calling the callback
     * @return Handle which can be destroyed to clear the timeout
     */
    function createTimer(callback, delay) {
        var timerId = setTimeout(callback, delay);
        return lang_1.createHandle(function () {
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
        });
    }
    exports.createTimer = createTimer;
    /**
     * Wraps a callback, returning a function which fires after no further calls are received over a set interval.
     *
     * @param callback Callback to wrap
     * @param delay Number of milliseconds to wait after any invocations before calling the original callback
     * @return Debounced function
     */
    function debounce(callback, delay) {
        // node.d.ts clobbers setTimeout/clearTimeout with versions that return/receive NodeJS.Timer,
        // but browsers return/receive a number
        var timer;
        return function () {
            timer && timer.destroy();
            var context = this;
            var args = arguments;
            timer = guaranteeMinimumTimeout(function () {
                callback.apply(context, args);
                args = context = timer = null;
            }, delay);
        };
    }
    exports.debounce = debounce;
    /**
     * Wraps a callback, returning a function which fires at most once per set interval.
     *
     * @param callback Callback to wrap
     * @param delay Number of milliseconds to wait before allowing the original callback to be called again
     * @return Throttled function
     */
    function throttle(callback, delay) {
        var ran;
        return function () {
            if (ran) {
                return;
            }
            ran = true;
            callback.apply(this, arguments);
            guaranteeMinimumTimeout(function () {
                ran = null;
            }, delay);
        };
    }
    exports.throttle = throttle;
    /**
     * Like throttle, but calls the callback at the end of each interval rather than the beginning.
     * Useful for e.g. resize or scroll events, when debounce would appear unresponsive.
     *
     * @param callback Callback to wrap
     * @param delay Number of milliseconds to wait before calling the original callback and allowing it to be called again
     * @return Throttled function
     */
    function throttleAfter(callback, delay) {
        var ran;
        return function () {
            if (ran) {
                return;
            }
            ran = true;
            var context = this;
            var args = arguments;
            guaranteeMinimumTimeout(function () {
                callback.apply(context, args);
                args = context = ran = null;
            }, delay);
        };
    }
    exports.throttleAfter = throttleAfter;
    function guaranteeMinimumTimeout(callback, delay) {
        var startTime = Date.now();
        var timerId;
        function timeoutHandler() {
            var delta = Date.now() - startTime;
            if (delay == null || delta >= delay) {
                callback();
            }
            else {
                // Cast setTimeout return value to fix TypeScript parsing bug.  Without it,
                // it thinks we are using the Node version of setTimeout.
                // Revisit this with the next TypeScript update.
                // Set another timer for the mount of time that we came up short.
                timerId = setTimeout(timeoutHandler, delay - delta);
            }
        }
        timerId = setTimeout(timeoutHandler, delay);
        return lang_1.createHandle(function () {
            if (timerId != null) {
                clearTimeout(timerId);
                timerId = null;
            }
        });
    }
    exports.guaranteeMinimumTimeout = guaranteeMinimumTimeout;
});
//# sourceMappingURL=util.js.map