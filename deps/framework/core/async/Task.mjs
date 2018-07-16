import { isArrayLike, isIterable } from '../../shim/iterator';
import ExtensiblePromise, { unwrapPromises } from './ExtensiblePromise';
/**
 * A type guard that determines if `value` is a `Task`
 * @param value The value to guard
 */
export function isTask(value) {
    return Boolean(value && typeof value.cancel === 'function' && Array.isArray(value.children) && isThenable(value));
}
/**
 * Returns true if a given value has a `then` method.
 * @param {any} value The value to check if is Thenable
 * @returns {is Thenable<T>} A type guard if the value is thenable
 */
export function isThenable(value) {
    return value && typeof value.then === 'function';
}
/**
 * Task is an extension of Promise that supports cancellation and the Task#finally method.
 */
export class Task extends ExtensiblePromise {
    /**
     * @constructor
     *
     * Create a new task. Executor is run immediately. The canceler will be called when the task is canceled.
     *
     * @param executor Method that initiates some task
     * @param canceler Method to call when the task is canceled
     *
     */
    constructor(executor, canceler) {
        // we have to initialize these to avoid a compiler error of using them before they are initialized
        let superResolve = () => { };
        let superReject = () => { };
        super((resolve, reject) => {
            superResolve = resolve;
            superReject = reject;
        });
        this._state = 1 /* Pending */;
        this.children = [];
        this.canceler = () => {
            if (canceler) {
                canceler();
            }
            this._cancel();
        };
        // Don't let the Task resolve if it's been canceled
        try {
            executor((value) => {
                if (this._state === 3 /* Canceled */) {
                    return;
                }
                this._state = 0 /* Fulfilled */;
                superResolve(value);
            }, (reason) => {
                if (this._state === 3 /* Canceled */) {
                    return;
                }
                this._state = 2 /* Rejected */;
                superReject(reason);
            });
        }
        catch (reason) {
            this._state = 2 /* Rejected */;
            superReject(reason);
        }
    }
    /**
     * Return a Task that resolves when one of the passed in objects have resolved
     *
     * @param iterable    An iterable of values to resolve. These can be Promises, ExtensiblePromises, or other objects
     * @returns {Task}
     */
    static race(iterable) {
        return new this((resolve, reject) => {
            Promise.race(unwrapPromises(iterable)).then(resolve, reject);
        });
    }
    /**
     * Return a rejected promise wrapped in a Task
     *
     * @param reason The reason for the rejection
     * @returns A task
     */
    static reject(reason) {
        return new this((resolve, reject) => reject(reason));
    }
    /**
     * Return a resolved task.
     *
     * @param value The value to resolve with
     *
     * @return A task
     */
    static resolve(value) {
        return new this((resolve, reject) => resolve(value));
    }
    /**
     * Return a ExtensiblePromise that resolves when all of the passed in objects have resolved. When used with a key/value
     * pair, the returned promise's argument is a key/value pair of the original keys with their resolved values.
     *
     * @example
     * ExtensiblePromise.all({ one: 1, two: 2 }).then(results => console.log(results));
     * // { one: 1, two: 2 }
     *
     * @param iterable    An iterable of values to resolve, or a key/value pair of values to resolve. These can be Promises, ExtensiblePromises, or other objects
     * @returns An extensible promise
     */
    static all(iterable) {
        return new Task((resolve, reject) => {
            super.all(iterable).then(resolve, reject);
        }, () => {
            if (isArrayLike(iterable)) {
                for (let i = 0; i < iterable.length; i++) {
                    const promiseLike = iterable[i];
                    if (isTask(promiseLike)) {
                        promiseLike.cancel();
                    }
                }
            }
            else if (isIterable(iterable)) {
                for (const promiseLike of iterable) {
                    if (isTask(promiseLike)) {
                        promiseLike.cancel();
                    }
                }
            }
            else {
                Object.keys(iterable).forEach((key) => {
                    const promiseLike = iterable[key];
                    if (isTask(promiseLike)) {
                        promiseLike.cancel();
                    }
                });
            }
        });
    }
    get state() {
        return this._state;
    }
    /**
     * Propagates cancellation down through a Task tree. The Task's state is immediately set to canceled. If a Thenable
     * finally task was passed in, it is resolved before calling this Task's finally callback; otherwise, this Task's
     * finally callback is immediately executed. `_cancel` is called for each child Task, passing in the value returned
     * by this Task's finally callback or a Promise chain that will eventually resolve to that value.
     */
    _cancel(finallyTask) {
        this._state = 3 /* Canceled */;
        const runFinally = () => {
            try {
                return this._finally && this._finally();
            }
            catch (error) {
                // Any errors in a `finally` callback are completely ignored during cancelation
            }
        };
        if (this._finally) {
            if (isThenable(finallyTask)) {
                finallyTask = finallyTask.then(runFinally, runFinally);
            }
            else {
                finallyTask = runFinally();
            }
        }
        this.children.forEach(function (child) {
            child._cancel(finallyTask);
        });
    }
    /**
     * Immediately cancels this task if it has not already resolved. This Task and any descendants are synchronously set
     * to the Canceled state and any `finally` added downstream from the canceled Task are invoked.
     */
    cancel() {
        if (this._state === 1 /* Pending */) {
            this.canceler();
        }
    }
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
    /**
     * Allows for cleanup actions to be performed after resolution of a Promise.
     */
    finally(callback) {
        // if this task is already canceled, call the task
        if (this._state === 3 /* Canceled */) {
            callback();
            return this;
        }
        const task = this.then((value) => Task.resolve(callback()).then(() => value), (reason) => Task.resolve(callback()).then(() => {
            throw reason;
        }));
        // Keep a reference to the callback; it will be called if the Task is canceled
        task._finally = callback;
        return task;
    }
    /**
     * Adds a callback to be invoked when the Task resolves or is rejected.
     *
     * @param onFulfilled   A function to call to handle the resolution. The paramter to the function will be the resolved value, if any.
     * @param onRejected    A function to call to handle the error. The parameter to the function will be the caught error.
     *
     * @returns A task
     */
    then(onFulfilled, onRejected) {
        // FIXME
        // tslint:disable-next-line:no-var-keyword
        var task = super.then(
        // Don't call the onFulfilled or onRejected handlers if this Task is canceled
        function (value) {
            if (task._state === 3 /* Canceled */) {
                return;
            }
            if (onFulfilled) {
                return onFulfilled(value);
            }
            return value;
        }, function (error) {
            if (task._state === 3 /* Canceled */) {
                return;
            }
            if (onRejected) {
                return onRejected(error);
            }
            throw error;
        });
        task.canceler = () => {
            // If task's parent (this) hasn't been resolved, cancel it; downward propagation will start at the first
            // unresolved parent
            if (this._state === 1 /* Pending */) {
                this.cancel();
            }
            else {
                // If task's parent has been resolved, propagate cancelation to the task's descendants
                task._cancel();
            }
        };
        // Keep track of child Tasks for propogating cancelation back down the chain
        this.children.push(task);
        return task;
    }
}
export default Task;
//# sourceMappingURL=Task.mjs.map