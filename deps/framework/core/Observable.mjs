import ObservableShim from '../shim/Observable';
import Promise from '../shim/Promise';
function isSubscribable(object) {
    return object && object.subscribe !== undefined;
}
export default class Observable extends ObservableShim {
    static of(...items) {
        return super.of(...items);
    }
    static from(item) {
        return super.from(item);
    }
    static defer(deferFunction) {
        return new Observable((observer) => {
            const trueObservable = deferFunction();
            return trueObservable.subscribe({
                next(value) {
                    return observer.next(value);
                },
                error(errorValue) {
                    return observer.error(errorValue);
                },
                complete(completeValue) {
                    observer.complete(completeValue);
                }
            });
        });
    }
    toPromise() {
        return new Promise((resolve, reject) => {
            this.subscribe({
                next(value) {
                    resolve(value);
                },
                error(error) {
                    reject(error);
                }
            });
        });
    }
    map(mapFunction) {
        const self = this;
        if (typeof mapFunction !== 'function') {
            throw new TypeError('Map parameter must be a function');
        }
        return new Observable((observer) => {
            self.subscribe({
                next(value) {
                    try {
                        const result = mapFunction(value);
                        return observer.next(result);
                    }
                    catch (e) {
                        return observer.error(e);
                    }
                },
                error(errorValue) {
                    return observer.error(errorValue);
                },
                complete(completeValue) {
                    return observer.complete(completeValue);
                }
            });
        });
    }
    filter(filterFunction) {
        const self = this;
        if (typeof filterFunction !== 'function') {
            throw new TypeError('Filter argument must be a function');
        }
        return new Observable((observer) => {
            self.subscribe({
                next(value) {
                    try {
                        if (filterFunction(value)) {
                            return observer.next(value);
                        }
                    }
                    catch (e) {
                        return observer.error(e);
                    }
                },
                error(errorValue) {
                    return observer.error(errorValue);
                },
                complete(completeValue) {
                    return observer.complete(completeValue);
                }
            });
        });
    }
    toArray() {
        const self = this;
        return new Observable((observer) => {
            const values = [];
            self.subscribe({
                next(value) {
                    values.push(value);
                },
                error(errorValue) {
                    return observer.error(errorValue);
                },
                complete(completeValue) {
                    observer.next(values);
                    observer.complete(completeValue);
                }
            });
        });
    }
    mergeAll(concurrent) {
        const self = this;
        return new Observable((observer) => {
            let active = [];
            let queue = [];
            function checkForComplete() {
                if (active.length === 0 && queue.length === 0) {
                    observer.complete();
                }
                else if (queue.length > 0 && active.length < concurrent) {
                    const item = queue.shift();
                    if (isSubscribable(item)) {
                        const itemIndex = active.length;
                        active.push(item);
                        item.subscribe({
                            next(value) {
                                observer.next(value);
                            },
                            complete() {
                                active.splice(itemIndex, 1);
                                checkForComplete();
                            }
                        });
                    }
                    else {
                        observer.next(item);
                        checkForComplete();
                    }
                }
            }
            self.subscribe({
                next(value) {
                    queue.push(value);
                },
                complete() {
                    checkForComplete();
                }
            });
        });
    }
}
// for convienence, re-export some interfaces from shim
export { Observable };
//# sourceMappingURL=Observable.mjs.map