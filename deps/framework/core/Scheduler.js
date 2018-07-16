(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./queue"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var queue_1 = require("./queue");
    function getQueueHandle(item) {
        return {
            destroy: function () {
                this.destroy = function () { };
                item.isActive = false;
                item.callback = null;
            }
        };
    }
    var Scheduler = /** @class */ (function () {
        function Scheduler(kwArgs) {
            this._deferred = null;
            this._task = null;
            this.deferWhileProcessing = kwArgs && 'deferWhileProcessing' in kwArgs ? kwArgs.deferWhileProcessing : true;
            this.queueFunction = kwArgs && kwArgs.queueFunction ? kwArgs.queueFunction : queue_1.queueTask;
            this._boundDispatch = this._dispatch.bind(this);
            this._isProcessing = false;
            this._queue = [];
        }
        Scheduler.prototype._defer = function (callback) {
            var item = {
                isActive: true,
                callback: callback
            };
            if (!this._deferred) {
                this._deferred = [];
            }
            this._deferred.push(item);
            return getQueueHandle(item);
        };
        Scheduler.prototype._dispatch = function () {
            this._isProcessing = true;
            if (this._task) {
                this._task.destroy();
                this._task = null;
            }
            var queue = this._queue;
            var item;
            while ((item = queue.shift())) {
                if (item.isActive && item.callback) {
                    item.callback();
                }
            }
            this._isProcessing = false;
            var deferred = this._deferred;
            if (deferred && deferred.length) {
                this._deferred = null;
                var item_1;
                while ((item_1 = deferred.shift())) {
                    this._schedule(item_1);
                }
            }
        };
        Scheduler.prototype._schedule = function (item) {
            if (!this._task) {
                this._task = this.queueFunction(this._boundDispatch);
            }
            this._queue.push(item);
        };
        Scheduler.prototype.schedule = function (callback) {
            if (this._isProcessing && this.deferWhileProcessing) {
                return this._defer(callback);
            }
            var item = {
                isActive: true,
                callback: callback
            };
            this._schedule(item);
            return getQueueHandle(item);
        };
        return Scheduler;
    }());
    exports.Scheduler = Scheduler;
    exports.default = Scheduler;
});
//# sourceMappingURL=Scheduler.js.map