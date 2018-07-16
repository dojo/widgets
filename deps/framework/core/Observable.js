(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/Observable", "../shim/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Observable_1 = require("../shim/Observable");
    var Promise_1 = require("../shim/Promise");
    function isSubscribable(object) {
        return object && object.subscribe !== undefined;
    }
    var Observable = /** @class */ (function (_super) {
        tslib_1.__extends(Observable, _super);
        function Observable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Observable.of = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            return _super.of.apply(this, tslib_1.__spread(items));
        };
        Observable.from = function (item) {
            return _super.from.call(this, item);
        };
        Observable.defer = function (deferFunction) {
            return new Observable(function (observer) {
                var trueObservable = deferFunction();
                return trueObservable.subscribe({
                    next: function (value) {
                        return observer.next(value);
                    },
                    error: function (errorValue) {
                        return observer.error(errorValue);
                    },
                    complete: function (completeValue) {
                        observer.complete(completeValue);
                    }
                });
            });
        };
        Observable.prototype.toPromise = function () {
            var _this = this;
            return new Promise_1.default(function (resolve, reject) {
                _this.subscribe({
                    next: function (value) {
                        resolve(value);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            });
        };
        Observable.prototype.map = function (mapFunction) {
            var self = this;
            if (typeof mapFunction !== 'function') {
                throw new TypeError('Map parameter must be a function');
            }
            return new Observable(function (observer) {
                self.subscribe({
                    next: function (value) {
                        try {
                            var result = mapFunction(value);
                            return observer.next(result);
                        }
                        catch (e) {
                            return observer.error(e);
                        }
                    },
                    error: function (errorValue) {
                        return observer.error(errorValue);
                    },
                    complete: function (completeValue) {
                        return observer.complete(completeValue);
                    }
                });
            });
        };
        Observable.prototype.filter = function (filterFunction) {
            var self = this;
            if (typeof filterFunction !== 'function') {
                throw new TypeError('Filter argument must be a function');
            }
            return new Observable(function (observer) {
                self.subscribe({
                    next: function (value) {
                        try {
                            if (filterFunction(value)) {
                                return observer.next(value);
                            }
                        }
                        catch (e) {
                            return observer.error(e);
                        }
                    },
                    error: function (errorValue) {
                        return observer.error(errorValue);
                    },
                    complete: function (completeValue) {
                        return observer.complete(completeValue);
                    }
                });
            });
        };
        Observable.prototype.toArray = function () {
            var self = this;
            return new Observable(function (observer) {
                var values = [];
                self.subscribe({
                    next: function (value) {
                        values.push(value);
                    },
                    error: function (errorValue) {
                        return observer.error(errorValue);
                    },
                    complete: function (completeValue) {
                        observer.next(values);
                        observer.complete(completeValue);
                    }
                });
            });
        };
        Observable.prototype.mergeAll = function (concurrent) {
            var self = this;
            return new Observable(function (observer) {
                var active = [];
                var queue = [];
                function checkForComplete() {
                    if (active.length === 0 && queue.length === 0) {
                        observer.complete();
                    }
                    else if (queue.length > 0 && active.length < concurrent) {
                        var item = queue.shift();
                        if (isSubscribable(item)) {
                            var itemIndex_1 = active.length;
                            active.push(item);
                            item.subscribe({
                                next: function (value) {
                                    observer.next(value);
                                },
                                complete: function () {
                                    active.splice(itemIndex_1, 1);
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
                    next: function (value) {
                        queue.push(value);
                    },
                    complete: function () {
                        checkForComplete();
                    }
                });
            });
        };
        return Observable;
    }(Observable_1.default));
    exports.Observable = Observable;
    exports.default = Observable;
});
//# sourceMappingURL=Observable.js.map