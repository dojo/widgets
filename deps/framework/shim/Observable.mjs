import * as tslib_1 from "tslib";
import global from './global';
import { isArrayLike, isIterable } from './iterator';
import has from './support/has';
import './Symbol';
export let Observable = global.Observable;
if (!has('es-observable')) {
    /*
     * Create a subscription observer for a given observer, and return the subscription.  The "logic" for Observerables
     * is in here!
     */
    const startSubscription = function startSubscription(executor, observer) {
        let closed = false;
        let cleanUp;
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
                const result = executor(subscriptionObserver);
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
            const next = observer.next;
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
                let cleanUpError = undefined;
                try {
                    unsubscribe();
                }
                catch (e) {
                    cleanUpError = e;
                }
                const observerError = observer.error;
                if (observerError !== undefined && observerError !== null) {
                    if (typeof observerError === 'function') {
                        const errorResult = observerError(errorValue);
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
                let cleanUpError = undefined;
                try {
                    unsubscribe();
                }
                catch (e) {
                    cleanUpError = e;
                }
                const observerComplete = observer.complete;
                if (observerComplete !== undefined && observerComplete !== null) {
                    if (typeof observerComplete === 'function') {
                        const completeResult = observerComplete(completeValue);
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
        const subscription = Object.create(Object.create({}, {
            closed: {
                enumerable: false,
                configurable: true,
                get() {
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
        const prototype = Object.create({}, {
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
                get() {
                    return closed;
                }
            }
        });
        // create the SubscriptionObserver and kick things off
        start(Object.create(prototype));
        // the ONLY way to control the SubscriptionObserver is with the subscription or from a subscriber
        return subscription;
    };
    Observable = (function () {
        function nonEnumerable(target, key, descriptor) {
            descriptor.enumerable = false;
        }
        class Observable {
            constructor(subscriber) {
                if (typeof subscriber !== 'function') {
                    throw new TypeError('subscriber is not a function');
                }
                this._executor = subscriber;
            }
            [_a = Symbol.observable]() {
                return this;
            }
            subscribe(observerOrNext, ...listeners) {
                const [onError, onComplete] = [...listeners];
                if (!observerOrNext ||
                    typeof observerOrNext === 'number' ||
                    typeof observerOrNext === 'string' ||
                    typeof observerOrNext === 'boolean') {
                    throw new TypeError('parameter must be a function or an observer');
                }
                let observer;
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
                return startSubscription(this._executor, observer);
            }
            static of(...items) {
                let constructor;
                if (typeof this !== 'function') {
                    constructor = Observable;
                }
                else {
                    constructor = this;
                }
                return new constructor((observer) => {
                    for (const o of items) {
                        observer.next(o);
                    }
                    observer.complete();
                });
            }
            static from(item) {
                if (item === null || item === undefined) {
                    throw new TypeError('item cannot be null or undefined');
                }
                let constructor;
                if (typeof this !== 'function') {
                    constructor = Observable;
                }
                else {
                    constructor = this;
                }
                const observableSymbol = item[Symbol.observable];
                if (observableSymbol !== undefined) {
                    if (typeof observableSymbol !== 'function') {
                        throw new TypeError('Symbol.observable must be a function');
                    }
                    const result = observableSymbol.call(item);
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
                else if (isIterable(item) || isArrayLike(item)) {
                    return new constructor((observer) => {
                        if (isArrayLike(item)) {
                            for (let i = 0; i < item.length; i++) {
                                observer.next(item[i]);
                            }
                        }
                        else {
                            for (const o of item) {
                                observer.next(o);
                            }
                        }
                        observer.complete();
                    });
                }
                else {
                    throw new TypeError('Parameter is neither Observable nor Iterable');
                }
            }
        }
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
    })();
}
export default Observable;
//# sourceMappingURL=Observable.mjs.map