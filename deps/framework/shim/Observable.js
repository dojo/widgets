(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./global", "./iterator", "./support/has", "./Symbol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var global_1 = require("./global");
    var iterator_1 = require("./iterator");
    var has_1 = require("./support/has");
    require("./Symbol");
    exports.Observable = global_1.default.Observable;
    if (!has_1.default('es-observable')) {
        /*
         * Create a subscription observer for a given observer, and return the subscription.  The "logic" for Observerables
         * is in here!
         */
        var startSubscription_1 = function startSubscription(executor, observer) {
            var closed = false;
            var cleanUp;
            function unsubscribe() {
                if (!closed) {
                    closed = true;
                    if (cleanUp) {
                        cleanUp();
                    }
                }
            }
            function start(subscriptionObserver) {
                if (observer.start) {
                    observer.start(subscription);
                }
                if (closed) {
                    return;
                }
                try {
                    var result = executor(subscriptionObserver);
                    if (typeof result === 'function') {
                        cleanUp = result;
                    }
                    else if (result && 'unsubscribe' in result) {
                        cleanUp = result.unsubscribe;
                    }
                    else if (result !== undefined && result !== null) {
                        throw new TypeError('Subscriber must return a callable or subscription');
                    }
                    if (closed) {
                        if (cleanUp) {
                            cleanUp();
                        }
                    }
                }
                catch (e) {
                    error(e);
                }
            }
            function next(value) {
                if (closed) {
                    return;
                }
                var next = observer.next;
                try {
                    if (typeof next === 'function') {
                        return next(value);
                    }
                    else if (next !== undefined && next !== null) {
                        throw new TypeError('Observer.next is not a function');
                    }
                }
                catch (e) {
                    error(e);
                }
            }
            function error(errorValue) {
                if (!closed) {
                    var cleanUpError = undefined;
                    try {
                        unsubscribe();
                    }
                    catch (e) {
                        cleanUpError = e;
                    }
                    var observerError = observer.error;
                    if (observerError !== undefined && observerError !== null) {
                        if (typeof observerError === 'function') {
                            var errorResult = observerError(errorValue);
                            if (cleanUpError !== undefined) {
                                throw cleanUpError;
                            }
                            return errorResult;
                        }
                        else {
                            throw new TypeError('Observer.error is not a function');
                        }
                    }
                    else if (observer.complete) {
                        return observer.complete(errorValue);
                    }
                    else {
                        throw errorValue;
                    }
                }
                else {
                    throw errorValue;
                }
            }
            function complete(completeValue) {
                if (!closed) {
                    var cleanUpError = undefined;
                    try {
                        unsubscribe();
                    }
                    catch (e) {
                        cleanUpError = e;
                    }
                    var observerComplete = observer.complete;
                    if (observerComplete !== undefined && observerComplete !== null) {
                        if (typeof observerComplete === 'function') {
                            var completeResult = observerComplete(completeValue);
                            if (cleanUpError !== undefined) {
                                throw cleanUpError;
                            }
                            return completeResult;
                        }
                        else {
                            throw new TypeError('Observer.complete is not a function');
                        }
                    }
                    else if (cleanUpError) {
                        throw cleanUpError;
                    }
                }
            }
            var subscription = Object.create(Object.create({}, {
                closed: {
                    enumerable: false,
                    configurable: true,
                    get: function () {
                        return closed;
                    }
                },
                unsubscribe: {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: unsubscribe
                }
            }));
            var prototype = Object.create({}, {
                next: {
                    enumerable: false,
                    writable: true,
                    value: next,
                    configurable: true
                },
                error: {
                    enumerable: false,
                    writable: true,
                    value: error,
                    configurable: true
                },
                complete: {
                    enumerable: false,
                    writable: true,
                    value: complete,
                    configurable: true
                },
                closed: {
                    enumerable: false,
                    configurable: true,
                    get: function () {
                        return closed;
                    }
                }
            });
            // create the SubscriptionObserver and kick things off
            start(Object.create(prototype));
            // the ONLY way to control the SubscriptionObserver is with the subscription or from a subscriber
            return subscription;
        };
        exports.Observable = (function () {
            function nonEnumerable(target, key, descriptor) {
                descriptor.enumerable = false;
            }
            var Observable = /** @class */ (function () {
                function Observable(subscriber) {
                    if (typeof subscriber !== 'function') {
                        throw new TypeError('subscriber is not a function');
                    }
                    this._executor = subscriber;
                }
                Observable.prototype[_a = Symbol.observable] = function () {
                    return this;
                };
                Observable.prototype.subscribe = function (observerOrNext) {
                    var listeners = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        listeners[_i - 1] = arguments[_i];
                    }
                    var _a = tslib_1.__read(tslib_1.__spread(listeners), 2), onError = _a[0], onComplete = _a[1];
                    if (!observerOrNext ||
                        typeof observerOrNext === 'number' ||
                        typeof observerOrNext === 'string' ||
                        typeof observerOrNext === 'boolean') {
                        throw new TypeError('parameter must be a function or an observer');
                    }
                    var observer;
                    if (typeof observerOrNext === 'function') {
                        observer = {
                            next: observerOrNext
                        };
                        if (typeof onError === 'function') {
                            observer.error = onError;
                        }
                        if (typeof onComplete === 'function') {
                            observer.complete = onComplete;
                        }
                    }
                    else {
                        observer = observerOrNext;
                    }
                    return startSubscription_1(this._executor, observer);
                };
                Observable.of = function () {
                    var items = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        items[_i] = arguments[_i];
                    }
                    var constructor;
                    if (typeof this !== 'function') {
                        constructor = Observable;
                    }
                    else {
                        constructor = this;
                    }
                    return new constructor(function (observer) {
                        try {
                            for (var items_1 = tslib_1.__values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                                var o = items_1_1.value;
                                observer.next(o);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        observer.complete();
                        var e_1, _a;
                    });
                };
                Observable.from = function (item) {
                    if (item === null || item === undefined) {
                        throw new TypeError('item cannot be null or undefined');
                    }
                    var constructor;
                    if (typeof this !== 'function') {
                        constructor = Observable;
                    }
                    else {
                        constructor = this;
                    }
                    var observableSymbol = item[Symbol.observable];
                    if (observableSymbol !== undefined) {
                        if (typeof observableSymbol !== 'function') {
                            throw new TypeError('Symbol.observable must be a function');
                        }
                        var result = observableSymbol.call(item);
                        if (result === undefined ||
                            result === null ||
                            typeof result === 'number' ||
                            typeof result === 'boolean' ||
                            typeof result === 'string') {
                            throw new TypeError('Return value of Symbol.observable must be object');
                        }
                        if ((result.constructor && result.constructor === this) || result instanceof Observable) {
                            return result;
                        }
                        else if (result.subscribe) {
                            return new constructor(result.subscribe);
                        }
                        else {
                            if (constructor.of) {
                                return constructor.of(result);
                            }
                            else {
                                return Observable.of(result);
                            }
                        }
                    }
                    else if (iterator_1.isIterable(item) || iterator_1.isArrayLike(item)) {
                        return new constructor(function (observer) {
                            if (iterator_1.isArrayLike(item)) {
                                for (var i = 0; i < item.length; i++) {
                                    observer.next(item[i]);
                                }
                            }
                            else {
                                try {
                                    for (var item_1 = tslib_1.__values(item), item_1_1 = item_1.next(); !item_1_1.done; item_1_1 = item_1.next()) {
                                        var o = item_1_1.value;
                                        observer.next(o);
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (item_1_1 && !item_1_1.done && (_a = item_1.return)) _a.call(item_1);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                            }
                            observer.complete();
                            var e_2, _a;
                        });
                    }
                    else {
                        throw new TypeError('Parameter is neither Observable nor Iterable');
                    }
                };
                tslib_1.__decorate([
                    nonEnumerable
                ], Observable.prototype, _a, null);
                tslib_1.__decorate([
                    nonEnumerable
                ], Observable.prototype, "subscribe", null);
                tslib_1.__decorate([
                    nonEnumerable
                ], Observable, "of", null);
                tslib_1.__decorate([
                    nonEnumerable
                ], Observable, "from", null);
                return Observable;
                var _a;
            }());
            return Observable;
        })();
    }
    exports.default = exports.Observable;
});
//# sourceMappingURL=Observable.js.map