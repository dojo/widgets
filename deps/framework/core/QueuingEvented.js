(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/Map", "./Evented"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Map_1 = require("../shim/Map");
    var Evented_1 = require("./Evented");
    /**
     * An implementation of the Evented class that queues up events when no listeners are
     * listening. When a listener is subscribed, the queue will be published to the listener.
     * When the queue is full, the oldest events will be discarded to make room for the newest ones.
     *
     * @property maxEvents  The number of events to queue before old events are discarded. If zero (default), an unlimited number of events is queued.
     */
    var QueuingEvented = /** @class */ (function (_super) {
        tslib_1.__extends(QueuingEvented, _super);
        function QueuingEvented() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._queue = new Map_1.default();
            _this.maxEvents = 0;
            return _this;
        }
        QueuingEvented.prototype.emit = function (event) {
            _super.prototype.emit.call(this, event);
            var hasMatch = false;
            this.listenersMap.forEach(function (method, type) {
                // Since `type` is generic, the compiler doesn't know what type it is and `isGlobMatch` requires `string | symbol`
                if (Evented_1.isGlobMatch(type, event.type)) {
                    hasMatch = true;
                }
            });
            if (!hasMatch) {
                var queue = this._queue.get(event.type);
                if (!queue) {
                    queue = [];
                    this._queue.set(event.type, queue);
                }
                queue.push(event);
                if (this.maxEvents > 0) {
                    while (queue.length > this.maxEvents) {
                        queue.shift();
                    }
                }
            }
        };
        QueuingEvented.prototype.on = function (type, listener) {
            var _this = this;
            var handle = _super.prototype.on.call(this, type, listener);
            this.listenersMap.forEach(function (method, listenerType) {
                _this._queue.forEach(function (events, queuedType) {
                    if (Evented_1.isGlobMatch(listenerType, queuedType)) {
                        events.forEach(function (event) { return _this.emit(event); });
                        _this._queue.delete(queuedType);
                    }
                });
            });
            return handle;
        };
        return QueuingEvented;
    }(Evented_1.default));
    exports.default = QueuingEvented;
});
//# sourceMappingURL=QueuingEvented.js.map