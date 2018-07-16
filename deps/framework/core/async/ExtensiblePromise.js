(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../shim/iterator", "../../shim/Promise", "../../shim/Symbol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var iterator_1 = require("../../shim/iterator");
    var Promise_1 = require("../../shim/Promise");
    require("../../shim/Symbol");
    /**
     * Take a list of values, and if any are ExtensiblePromise objects, insert the wrapped Promise in its place,
     * otherwise use the original object. We use this to help use the native Promise methods like `all` and `race`.
     *
     * @param iterable    The list of objects to iterate over
     * @returns {any[]}    The list of objects, as an array, with ExtensiblePromises being replaced by Promises.
     */
    function unwrapPromises(iterable) {
        var unwrapped = [];
        if (iterator_1.isArrayLike(iterable)) {
            for (var i = 0; i < iterable.length; i++) {
                var item = iterable[i];
                unwrapped.push(item instanceof ExtensiblePromise ? item._promise : item);
            }
        }
        else {
            try {
                for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                    var item = iterable_1_1.value;
                    unwrapped.push(item instanceof ExtensiblePromise ? item._promise : item);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return unwrapped;
        var e_1, _a;
    }
    exports.unwrapPromises = unwrapPromises;
    /**
     * An extensible base to allow Promises to be extended in ES5. This class basically wraps a native Promise object,
     * giving an API like a native promise.
     */
    var ExtensiblePromise = /** @class */ (function () {
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
        function ExtensiblePromise(executor) {
            this._promise = new Promise_1.default(executor);
        }
        /**
         * Return a rejected promise wrapped in an ExtensiblePromise
         *
         * @param reason    The reason for the rejection
         * @returns An extensible promise
         */
        ExtensiblePromise.reject = function (reason) {
            return new this(function (resolve, reject) { return reject(reason); });
        };
        ExtensiblePromise.resolve = function (value) {
            return new this(function (resolve, reject) { return resolve(value); });
        };
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
        ExtensiblePromise.all = function (iterable) {
            if (!iterator_1.isArrayLike(iterable) && !iterator_1.isIterable(iterable)) {
                var promiseKeys_1 = Object.keys(iterable);
                return new this(function (resolve, reject) {
                    Promise_1.default.all(promiseKeys_1.map(function (key) { return iterable[key]; })).then(function (promiseResults) {
                        var returnValue = {};
                        promiseResults.forEach(function (value, index) {
                            returnValue[promiseKeys_1[index]] = value;
                        });
                        resolve(returnValue);
                    }, reject);
                });
            }
            return new this(function (resolve, reject) {
                Promise_1.default.all(unwrapPromises(iterable)).then(resolve, reject);
            });
        };
        /**
         * Return a ExtensiblePromise that resolves when one of the passed in objects have resolved
         *
         * @param iterable    An iterable of values to resolve. These can be Promises, ExtensiblePromises, or other objects
         * @returns {ExtensiblePromise}
         */
        ExtensiblePromise.race = function (iterable) {
            return new this(function (resolve, reject) {
                Promise_1.default.race(unwrapPromises(iterable)).then(resolve, reject);
            });
        };
        /**
         * Adds a callback to be invoked when the wrapped Promise is rejected.
         *
         * @param {Function} onRejected A function to call to handle the error. The parameter to the function will be the caught error.
         *
         * @returns {ExtensiblePromise}
         */
        ExtensiblePromise.prototype.catch = function (onRejected) {
            return this.then(undefined, onRejected);
        };
        /**
         * Adds a callback to be invoked when the wrapped Promise resolves or is rejected.
         *
         * @param {Function} onFulfilled   A function to call to handle the resolution. The paramter to the function will be the resolved value, if any.
         * @param {Function} onRejected    A function to call to handle the error. The parameter to the function will be the caught error.
         *
         * @returns {ExtensiblePromise}
         */
        ExtensiblePromise.prototype.then = function (onFulfilled, onRejected) {
            var _this = this;
            var executor = function (resolve, reject) {
                function handler(rejected, valueOrError) {
                    var callback = rejected ? onRejected : onFulfilled;
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
                _this._promise.then(handler.bind(null, false), handler.bind(null, true));
            };
            return new this.constructor(executor);
        };
        return ExtensiblePromise;
    }());
    exports.ExtensiblePromise = ExtensiblePromise;
    exports.default = ExtensiblePromise;
});
//# sourceMappingURL=ExtensiblePromise.js.map