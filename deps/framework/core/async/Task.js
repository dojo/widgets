(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../shim/iterator", "./ExtensiblePromise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var iterator_1 = require("../../shim/iterator");
    var ExtensiblePromise_1 = require("./ExtensiblePromise");
    /**
     * A type guard that determines if `value` is a `Task`
     * @param value The value to guard
     */
    function isTask(value) {
        return Boolean(value && typeof value.cancel === 'function' && Array.isArray(value.children) && isThenable(value));
    }
    exports.isTask = isTask;
    /**
     * Returns true if a given value has a `then` method.
     * @param {any} value The value to check if is Thenable
     * @returns {is Thenable<T>} A type guard if the value is thenable
     */
    function isThenable(value) {
        return value && typeof value.then === 'function';
    }
    exports.isThenable = isThenable;
    /**
     * Task is an extension of Promise that supports cancellation and the Task#finally method.
     */
    var Task = /** @class */ (function (_super) {
        tslib_1.__extends(Task, _super);
        /**
         * @constructor
         *
         * Create a new task. Executor is run immediately. The canceler will be called when the task is canceled.
         *
         * @param executor Method that initiates some task
         * @param canceler Method to call when the task is canceled
         *
         */
        function Task(executor, canceler) {
            var _this = this;
            // we have to initialize these to avoid a compiler error of using them before they are initialized
            var superResolve = function () { };
            var superReject = function () { };
            _this = _super.call(this, function (resolve, reject) {
                superResolve = resolve;
                superReject = reject;
            }) || this;
            _this._state = 1 /* Pending */;
            _this.children = [];
            _this.canceler = function () {
                if (canceler) {
                    canceler();
                }
                _this._cancel();
            };
            // Don't let the Task resolve if it's been canceled
            try {
                executor(function (value) {
                    if (_this._state === 3 /* Canceled */) {
                        return;
                    }
                    _this._state = 0 /* Fulfilled */;
                    superResolve(value);
                }, function (reason) {
                    if (_this._state === 3 /* Canceled */) {
                        return;
                    }
                    _this._state = 2 /* Rejected */;
                    superReject(reason);
                });
            }
            catch (reason) {
                _this._state = 2 /* Rejected */;
                superReject(reason);
            }
            return _this;
        }
        /**
         * Return a Task that resolves when one of the passed in objects have resolved
         *
         * @param iterable    An iterable of values to resolve. These can be Promises, ExtensiblePromises, or other objects
         * @returns {Task}
         */
        Task.race = function (iterable) {
            return new this(function (resolve, reject) {
                Promise.race(ExtensiblePromise_1.unwrapPromises(iterable)).then(resolve, reject);
            });
        };
        /**
         * Return a rejected promise wrapped in a Task
         *
         * @param reason The reason for the rejection
         * @returns A task
         */
        Task.reject = function (reason) {
            return new this(function (resolve, reject) { return reject(reason); });
        };
        /**
         * Return a resolved task.
         *
         * @param value The value to resolve with
         *
         * @return A task
         */
        Task.resolve = function (value) {
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
        Task.all = function (iterable) {
            var _this = this;
            return new Task(function (resolve, reject) {
                _super.all.call(_this, iterable).then(resolve, reject);
            }, function () {
                if (iterator_1.isArrayLike(iterable)) {
                    for (var i = 0; i < iterable.length; i++) {
                        var promiseLike = iterable[i];
                        if (isTask(promiseLike)) {
                            promiseLike.cancel();
                        }
                    }
                }
                else if (iterator_1.isIterable(iterable)) {
                    try {
                        for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                            var promiseLike = iterable_1_1.value;
                            if (isTask(promiseLike)) {
                                promiseLike.cancel();
                            }
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
                else {
                    Object.keys(iterable).forEach(function (key) {
                        var promiseLike = iterable[key];
                        if (isTask(promiseLike)) {
                            promiseLike.cancel();
                        }
                    });
                }
                var e_1, _a;
            });
        };
        Object.defineProperty(Task.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Propagates cancellation down through a Task tree. The Task's state is immediately set to canceled. If a Thenable
         * finally task was passed in, it is resolved before calling this Task's finally callback; otherwise, this Task's
         * finally callback is immediately executed. `_cancel` is called for each child Task, passing in the value returned
         * by this Task's finally callback or a Promise chain that will eventually resolve to that value.
         */
        Task.prototype._cancel = function (finallyTask) {
            var _this = this;
            this._state = 3 /* Canceled */;
            var runFinally = function () {
                try {
                    return _this._finally && _this._finally();
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
        };
        /**
         * Immediately cancels this task if it has not already resolved. This Task and any descendants are synchronously set
         * to the Canceled state and any `finally` added downstream from the canceled Task are invoked.
         */
        Task.prototype.cancel = function () {
            if (this._state === 1 /* Pending */) {
                this.canceler();
            }
        };
        Task.prototype.catch = function (onRejected) {
            return this.then(undefined, onRejected);
        };
        /**
         * Allows for cleanup actions to be performed after resolution of a Promise.
         */
        Task.prototype.finally = function (callback) {
            // if this task is already canceled, call the task
            if (this._state === 3 /* Canceled */) {
                callback();
                return this;
            }
            var task = this.then(function (value) { return Task.resolve(callback()).then(function () { return value; }); }, function (reason) {
                return Task.resolve(callback()).then(function () {
                    throw reason;
                });
            });
            // Keep a reference to the callback; it will be called if the Task is canceled
            task._finally = callback;
            return task;
        };
        /**
         * Adds a callback to be invoked when the Task resolves or is rejected.
         *
         * @param onFulfilled   A function to call to handle the resolution. The paramter to the function will be the resolved value, if any.
         * @param onRejected    A function to call to handle the error. The parameter to the function will be the caught error.
         *
         * @returns A task
         */
        Task.prototype.then = function (onFulfilled, onRejected) {
            var _this = this;
            // FIXME
            // tslint:disable-next-line:no-var-keyword
            var task = _super.prototype.then.call(this, 
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
            task.canceler = function () {
                // If task's parent (this) hasn't been resolved, cancel it; downward propagation will start at the first
                // unresolved parent
                if (_this._state === 1 /* Pending */) {
                    _this.cancel();
                }
                else {
                    // If task's parent has been resolved, propagate cancelation to the task's descendants
                    task._cancel();
                }
            };
            // Keep track of child Tasks for propogating cancelation back down the chain
            this.children.push(task);
            return task;
        };
        return Task;
    }(ExtensiblePromise_1.default));
    exports.Task = Task;
    exports.default = Task;
});
//# sourceMappingURL=Task.js.map