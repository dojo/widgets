(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SubscriptionPool = /** @class */ (function () {
        function SubscriptionPool(maxLength) {
            if (maxLength === void 0) { maxLength = 10; }
            this._observers = [];
            this._queue = [];
            this._queueMaxLength = maxLength;
        }
        SubscriptionPool.prototype.add = function (subscription) {
            var _this = this;
            this._observers.push(subscription);
            while (this._queue.length > 0) {
                this.next(this._queue.shift());
            }
            return function () {
                _this._observers.splice(_this._observers.indexOf(subscription), 1);
            };
        };
        SubscriptionPool.prototype.next = function (value) {
            if (this._observers.length === 0) {
                this._queue.push(value);
                // when the queue is full, get rid of the first ones
                while (this._queue.length > this._queueMaxLength) {
                    this._queue.shift();
                }
            }
            this._observers.forEach(function (observer) {
                observer.next(value);
            });
        };
        SubscriptionPool.prototype.complete = function () {
            this._observers.forEach(function (observer) {
                observer.complete();
            });
        };
        return SubscriptionPool;
    }());
    exports.SubscriptionPool = SubscriptionPool;
    exports.default = SubscriptionPool;
});
//# sourceMappingURL=SubscriptionPool.js.map