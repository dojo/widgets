(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./global", "./support/queue", "./Symbol", "./support/has"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var global_1 = require("./global");
    var queue_1 = require("./support/queue");
    require("./Symbol");
    var has_1 = require("./support/has");
    exports.ShimPromise = global_1.default.Promise;
    exports.isThenable = function isThenable(value) {
        return value && typeof value.then === 'function';
    };
    if (!has_1.default('es6-promise')) {
        global_1.default.Promise = exports.ShimPromise = (_a = /** @class */ (function () {
                /**
                 * Creates a new Promise.
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
                function Promise(executor) {
                    var _this = this;
                    /**
                     * The current state of this promise.
                     */
                    this.state = 1 /* Pending */;
                    this[Symbol.toStringTag] = 'Promise';
                    /**
                     * If true, the resolution of this promise is chained ("locked in") to another promise.
                     */
                    var isChained = false;
                    /**
                     * Whether or not this promise is in a resolved state.
                     */
                    var isResolved = function () {
                        return _this.state !== 1 /* Pending */ || isChained;
                    };
                    /**
                     * Callbacks that should be invoked once the asynchronous operation has completed.
                     */
                    var callbacks = [];
                    /**
                     * Initially pushes callbacks onto a queue for execution once this promise settles. After the promise settles,
                     * enqueues callbacks for execution on the next event loop turn.
                     */
                    var whenFinished = function (callback) {
                        if (callbacks) {
                            callbacks.push(callback);
                        }
                    };
                    /**
                     * Settles this promise.
                     *
                     * @param newState The resolved state for this promise.
                     * @param {T|any} value The resolved value for this promise.
                     */
                    var settle = function (newState, value) {
                        // A promise can only be settled once.
                        if (_this.state !== 1 /* Pending */) {
                            return;
                        }
                        _this.state = newState;
                        _this.resolvedValue = value;
                        whenFinished = queue_1.queueMicroTask;
                        // Only enqueue a callback runner if there are callbacks so that initially fulfilled Promises don't have to
                        // wait an extra turn.
                        if (callbacks && callbacks.length > 0) {
                            queue_1.queueMicroTask(function () {
                                if (callbacks) {
                                    var count = callbacks.length;
                                    for (var i = 0; i < count; ++i) {
                                        callbacks[i].call(null);
                                    }
                                    callbacks = null;
                                }
                            });
                        }
                    };
                    /**
                     * Resolves this promise.
                     *
                     * @param newState The resolved state for this promise.
                     * @param {T|any} value The resolved value for this promise.
                     */
                    var resolve = function (newState, value) {
                        if (isResolved()) {
                            return;
                        }
                        if (exports.isThenable(value)) {
                            value.then(settle.bind(null, 0 /* Fulfilled */), settle.bind(null, 2 /* Rejected */));
                            isChained = true;
                        }
                        else {
                            settle(newState, value);
                        }
                    };
                    this.then = function (onFulfilled, onRejected) {
                        return new Promise(function (resolve, reject) {
                            // whenFinished initially queues up callbacks for execution after the promise has settled. Once the
                            // promise has settled, whenFinished will schedule callbacks for execution on the next turn through the
                            // event loop.
                            whenFinished(function () {
                                var callback = _this.state === 2 /* Rejected */ ? onRejected : onFulfilled;
                                if (typeof callback === 'function') {
                                    try {
                                        resolve(callback(_this.resolvedValue));
                                    }
                                    catch (error) {
                                        reject(error);
                                    }
                                }
                                else if (_this.state === 2 /* Rejected */) {
                                    reject(_this.resolvedValue);
                                }
                                else {
                                    resolve(_this.resolvedValue);
                                }
                            });
                        });
                    };
                    try {
                        executor(resolve.bind(null, 0 /* Fulfilled */), resolve.bind(null, 2 /* Rejected */));
                    }
                    catch (error) {
                        settle(2 /* Rejected */, error);
                    }
                }
                Promise.all = function (iterable) {
                    return new this(function (resolve, reject) {
                        var values = [];
                        var complete = 0;
                        var total = 0;
                        var populating = true;
                        function fulfill(index, value) {
                            values[index] = value;
                            ++complete;
                            finish();
                        }
                        function finish() {
                            if (populating || complete < total) {
                                return;
                            }
                            resolve(values);
                        }
                        function processItem(index, item) {
                            ++total;
                            if (exports.isThenable(item)) {
                                // If an item Promise rejects, this Promise is immediately rejected with the item
                                // Promise's rejection error.
                                item.then(fulfill.bind(null, index), reject);
                            }
                            else {
                                Promise.resolve(item).then(fulfill.bind(null, index));
                            }
                        }
                        var i = 0;
                        try {
                            for (var iterable_1 = tslib_1.__values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                                var value = iterable_1_1.value;
                                processItem(i, value);
                                i++;
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        populating = false;
                        finish();
                        var e_1, _a;
                    });
                };
                Promise.race = function (iterable) {
                    return new this(function (resolve, reject) {
                        try {
                            for (var iterable_2 = tslib_1.__values(iterable), iterable_2_1 = iterable_2.next(); !iterable_2_1.done; iterable_2_1 = iterable_2.next()) {
                                var item = iterable_2_1.value;
                                if (item instanceof Promise) {
                                    // If a Promise item rejects, this Promise is immediately rejected with the item
                                    // Promise's rejection error.
                                    item.then(resolve, reject);
                                }
                                else {
                                    Promise.resolve(item).then(resolve);
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (iterable_2_1 && !iterable_2_1.done && (_a = iterable_2.return)) _a.call(iterable_2);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        var e_2, _a;
                    });
                };
                Promise.reject = function (reason) {
                    return new this(function (resolve, reject) {
                        reject(reason);
                    });
                };
                Promise.resolve = function (value) {
                    return new this(function (resolve) {
                        resolve(value);
                    });
                };
                Promise.prototype.catch = function (onRejected) {
                    return this.then(undefined, onRejected);
                };
                return Promise;
            }()),
            _a[Symbol.species] = exports.ShimPromise,
            _a);
    }
    exports.default = exports.ShimPromise;
    var _a;
});
//# sourceMappingURL=Promise.js.map