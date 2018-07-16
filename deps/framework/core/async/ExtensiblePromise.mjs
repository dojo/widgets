import { isArrayLike, isIterable } from '../../shim/iterator';
import Promise from '../../shim/Promise';
import '../../shim/Symbol';
/**
 * Take a list of values, and if any are ExtensiblePromise objects, insert the wrapped Promise in its place,
 * otherwise use the original object. We use this to help use the native Promise methods like `all` and `race`.
 *
 * @param iterable    The list of objects to iterate over
 * @returns {any[]}    The list of objects, as an array, with ExtensiblePromises being replaced by Promises.
 */
export function unwrapPromises(iterable) {
    const unwrapped = [];
    if (isArrayLike(iterable)) {
        for (let i = 0; i < iterable.length; i++) {
            const item = iterable[i];
            unwrapped.push(item instanceof ExtensiblePromise ? item._promise : item);
        }
    }
    else {
        for (const item of iterable) {
            unwrapped.push(item instanceof ExtensiblePromise ? item._promise : item);
        }
    }
    return unwrapped;
}
/**
 * An extensible base to allow Promises to be extended in ES5. This class basically wraps a native Promise object,
 * giving an API like a native promise.
 */
export class ExtensiblePromise {
    /**
     * Creates a new extended Promise.
     *
     * @constructor
     *
     * @param executor
     * The executor function is called immediately when the Promise is instantiated. It is responsible for
     * starting the asynchronous operation when it is invoked.
     *
     * The executor must call either the passed `resolve` function when the asynchronous operation has completed
     * successfully, or the `reject` function when the operation fails.
     */
    constructor(executor) {
        this._promise = new Promise(executor);
    }
    /**
     * Return a rejected promise wrapped in an ExtensiblePromise
     *
     * @param reason    The reason for the rejection
     * @returns An extensible promise
     */
    static reject(reason) {
        return new this((resolve, reject) => reject(reason));
    }
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
        if (!isArrayLike(iterable) && !isIterable(iterable)) {
            const promiseKeys = Object.keys(iterable);
            return new this((resolve, reject) => {
                Promise.all(promiseKeys.map((key) => iterable[key])).then((promiseResults) => {
                    const returnValue = {};
                    promiseResults.forEach((value, index) => {
                        returnValue[promiseKeys[index]] = value;
                    });
                    resolve(returnValue);
                }, reject);
            });
        }
        return new this((resolve, reject) => {
            Promise.all(unwrapPromises(iterable)).then(resolve, reject);
        });
    }
    /**
     * Return a ExtensiblePromise that resolves when one of the passed in objects have resolved
     *
     * @param iterable    An iterable of values to resolve. These can be Promises, ExtensiblePromises, or other objects
     * @returns {ExtensiblePromise}
     */
    static race(iterable) {
        return new this((resolve, reject) => {
            Promise.race(unwrapPromises(iterable)).then(resolve, reject);
        });
    }
    /**
     * Adds a callback to be invoked when the wrapped Promise is rejected.
     *
     * @param {Function} onRejected A function to call to handle the error. The parameter to the function will be the caught error.
     *
     * @returns {ExtensiblePromise}
     */
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
    /**
     * Adds a callback to be invoked when the wrapped Promise resolves or is rejected.
     *
     * @param {Function} onFulfilled   A function to call to handle the resolution. The paramter to the function will be the resolved value, if any.
     * @param {Function} onRejected    A function to call to handle the error. The parameter to the function will be the caught error.
     *
     * @returns {ExtensiblePromise}
     */
    then(onFulfilled, onRejected) {
        const executor = (resolve, reject) => {
            function handler(rejected, valueOrError) {
                const callback = rejected ? onRejected : onFulfilled;
                if (typeof callback === 'function') {
                    try {
                        resolve(callback(valueOrError));
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                else if (rejected) {
                    reject(valueOrError);
                }
                else {
                    resolve(valueOrError);
                }
            }
            this._promise.then(handler.bind(null, false), handler.bind(null, true));
        };
        return new this.constructor(executor);
    }
}
export default ExtensiblePromise;
//# sourceMappingURL=ExtensiblePromise.mjs.map