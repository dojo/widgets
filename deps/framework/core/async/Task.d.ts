import { Thenable } from '../../shim/interfaces';
import { Iterable } from '../../shim/iterator';
import { Executor } from '../../shim/Promise';
import ExtensiblePromise, { DictionaryOfPromises, ListOfPromises } from './ExtensiblePromise';
/**
 * Describe the internal state of a task.
 */
export declare const enum State {
    Fulfilled = 0,
    Pending = 1,
    Rejected = 2,
    Canceled = 3,
}
/**
 * A type guard that determines if `value` is a `Task`
 * @param value The value to guard
 */
export declare function isTask<T>(value: any): value is Task<T>;
/**
 * Returns true if a given value has a `then` method.
 * @param {any} value The value to check if is Thenable
 * @returns {is Thenable<T>} A type guard if the value is thenable
 */
export declare function isThenable<T>(value: any): value is Thenable<T>;
/**
 * Task is an extension of Promise that supports cancellation and the Task#finally method.
 */
export declare class Task<T> extends ExtensiblePromise<T> {
    /**
     * Return a Task that resolves when one of the passed in objects have resolved
     *
     * @param iterable    An iterable of values to resolve. These can be Promises, ExtensiblePromises, or other objects
     * @returns {Task}
     */
    static race<T>(iterable: Iterable<T | Thenable<T>> | (T | Thenable<T>)[]): Task<T>;
    /**
     * Return a rejected promise wrapped in a Task
     *
     * @param reason The reason for the rejection
     * @returns A task
     */
    static reject<T>(reason?: Error): Task<T>;
    /**
     * Return a resolved task.
     *
     * @param value The value to resolve with
     *
     * @return A task
     */
    static resolve(): Task<void>;
    /**
     * Return a resolved task.
     *
     * @param value The value to resolve with
     *
     * @return A task
     */
    static resolve<T>(value: T | Thenable<T>): Task<T>;
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
    static all<T>(iterable: DictionaryOfPromises<T>): Task<{
        [key: string]: T;
    }>;
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
    static all<T>(iterable: (T | Thenable<T>)[]): Task<T[]>;
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
    static all<T>(iterable: T | Thenable<T>): Task<T[]>;
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
    static all<T>(iterable: ListOfPromises<T>): Task<T[]>;
    /**
     * A cancelation handler that will be called if this task is canceled.
     */
    private canceler;
    /**
     * Children of this Task (i.e., Tasks that were created from this Task with `then` or `catch`).
     */
    private readonly children;
    /**
     * The finally callback for this Task (if it was created by a call to `finally`).
     */
    private _finally;
    /**
     * The state of the task
     */
    protected _state: State;
    readonly state: State;
    /**
     * @constructor
     *
     * Create a new task. Executor is run immediately. The canceler will be called when the task is canceled.
     *
     * @param executor Method that initiates some task
     * @param canceler Method to call when the task is canceled
     *
     */
    constructor(executor: Executor<T>, canceler?: () => void);
    /**
     * Propagates cancellation down through a Task tree. The Task's state is immediately set to canceled. If a Thenable
     * finally task was passed in, it is resolved before calling this Task's finally callback; otherwise, this Task's
     * finally callback is immediately executed. `_cancel` is called for each child Task, passing in the value returned
     * by this Task's finally callback or a Promise chain that will eventually resolve to that value.
     */
    private _cancel(finallyTask?);
    /**
     * Immediately cancels this task if it has not already resolved. This Task and any descendants are synchronously set
     * to the Canceled state and any `finally` added downstream from the canceled Task are invoked.
     */
    cancel(): void;
    catch<TResult = never>(onRejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined): Task<T | TResult>;
    /**
     * Allows for cleanup actions to be performed after resolution of a Promise.
     */
    finally(callback: () => void): Task<T>;
    /**
     * Adds a callback to be invoked when the Task resolves or is rejected.
     *
     * @param onFulfilled   A function to call to handle the resolution. The paramter to the function will be the resolved value, if any.
     * @param onRejected    A function to call to handle the error. The parameter to the function will be the caught error.
     *
     * @returns A task
     */
    then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Task<TResult1 | TResult2>;
}
export default Task;
