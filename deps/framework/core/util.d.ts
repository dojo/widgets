import { Handle } from './interfaces';
/**
 * Wraps a setTimeout call in a handle, allowing the timeout to be cleared by calling destroy.
 *
 * @param callback Callback to be called when the timeout elapses
 * @param delay Number of milliseconds to wait before calling the callback
 * @return Handle which can be destroyed to clear the timeout
 */
export declare function createTimer(callback: (...args: any[]) => void, delay?: number): Handle;
/**
 * Wraps a callback, returning a function which fires after no further calls are received over a set interval.
 *
 * @param callback Callback to wrap
 * @param delay Number of milliseconds to wait after any invocations before calling the original callback
 * @return Debounced function
 */
export declare function debounce<T extends (this: any, ...args: any[]) => void>(callback: T, delay: number): T;
/**
 * Wraps a callback, returning a function which fires at most once per set interval.
 *
 * @param callback Callback to wrap
 * @param delay Number of milliseconds to wait before allowing the original callback to be called again
 * @return Throttled function
 */
export declare function throttle<T extends (this: any, ...args: any[]) => void>(callback: T, delay: number): T;
/**
 * Like throttle, but calls the callback at the end of each interval rather than the beginning.
 * Useful for e.g. resize or scroll events, when debounce would appear unresponsive.
 *
 * @param callback Callback to wrap
 * @param delay Number of milliseconds to wait before calling the original callback and allowing it to be called again
 * @return Throttled function
 */
export declare function throttleAfter<T extends (this: any, ...args: any[]) => void>(callback: T, delay: number): T;
export declare function guaranteeMinimumTimeout(callback: (...args: any[]) => void, delay?: number): Handle;
