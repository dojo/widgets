import { createHandle } from './lang';
/**
 * Wraps a setTimeout call in a handle, allowing the timeout to be cleared by calling destroy.
 *
 * @param callback Callback to be called when the timeout elapses
 * @param delay Number of milliseconds to wait before calling the callback
 * @return Handle which can be destroyed to clear the timeout
 */
export function createTimer(callback, delay) {
    let timerId = setTimeout(callback, delay);
    return createHandle(function () {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
    });
}
/**
 * Wraps a callback, returning a function which fires after no further calls are received over a set interval.
 *
 * @param callback Callback to wrap
 * @param delay Number of milliseconds to wait after any invocations before calling the original callback
 * @return Debounced function
 */
export function debounce(callback, delay) {
    // node.d.ts clobbers setTimeout/clearTimeout with versions that return/receive NodeJS.Timer,
    // but browsers return/receive a number
    let timer;
    return function () {
        timer && timer.destroy();
        let context = this;
        let args = arguments;
        timer = guaranteeMinimumTimeout(function () {
            callback.apply(context, args);
            args = context = timer = null;
        }, delay);
    };
}
/**
 * Wraps a callback, returning a function which fires at most once per set interval.
 *
 * @param callback Callback to wrap
 * @param delay Number of milliseconds to wait before allowing the original callback to be called again
 * @return Throttled function
 */
export function throttle(callback, delay) {
    let ran;
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
/**
 * Like throttle, but calls the callback at the end of each interval rather than the beginning.
 * Useful for e.g. resize or scroll events, when debounce would appear unresponsive.
 *
 * @param callback Callback to wrap
 * @param delay Number of milliseconds to wait before calling the original callback and allowing it to be called again
 * @return Throttled function
 */
export function throttleAfter(callback, delay) {
    let ran;
    return function () {
        if (ran) {
            return;
        }
        ran = true;
        let context = this;
        let args = arguments;
        guaranteeMinimumTimeout(function () {
            callback.apply(context, args);
            args = context = ran = null;
        }, delay);
    };
}
export function guaranteeMinimumTimeout(callback, delay) {
    const startTime = Date.now();
    let timerId;
    function timeoutHandler() {
        const delta = Date.now() - startTime;
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
    return createHandle(() => {
        if (timerId != null) {
            clearTimeout(timerId);
            timerId = null;
        }
    });
}
//# sourceMappingURL=util.mjs.map