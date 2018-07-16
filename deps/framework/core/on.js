(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./lang"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var lang_1 = require("./lang");
    function emit(target, event) {
        if (target.dispatchEvent /* includes window and document */ &&
            ((target.ownerDocument && target.ownerDocument.createEvent) /* matches nodes */ ||
                (target.document && target.document.createEvent) /* matches window */ ||
                target.createEvent) /* matches document */) {
            var nativeEvent = (target.ownerDocument || target.document || target).createEvent('HTMLEvents');
            nativeEvent.initEvent(event.type, Boolean(event.bubbles), Boolean(event.cancelable));
            for (var key in event) {
                if (!(key in nativeEvent)) {
                    nativeEvent[key] = event[key];
                }
            }
            return target.dispatchEvent(nativeEvent);
        }
        if (target.emit) {
            if (target.removeListener) {
                // Node.js EventEmitter
                target.emit(event.type, event);
                return false;
            }
            else if (target.on) {
                // Dojo Evented or similar
                target.emit(event);
                return false;
            }
        }
        throw new Error('Target must be an event emitter');
    }
    exports.emit = emit;
    function on(target, type, listener, capture) {
        if (Array.isArray(type)) {
            var handles = type.map(function (type) {
                return on(target, type, listener, capture);
            });
            return lang_1.createCompositeHandle.apply(void 0, tslib_1.__spread(handles));
        }
        var callback = function () {
            listener.apply(this, arguments);
        };
        // DOM EventTarget
        if (target.addEventListener && target.removeEventListener) {
            target.addEventListener(type, callback, capture);
            return lang_1.createHandle(function () {
                target.removeEventListener(type, callback, capture);
            });
        }
        if (target.on) {
            // EventEmitter
            if (target.removeListener) {
                target.on(type, callback);
                return lang_1.createHandle(function () {
                    target.removeListener(type, callback);
                });
            }
            else if (target.emit) {
                // Evented
                return target.on(type, listener);
            }
        }
        throw new TypeError('Unknown event emitter object');
    }
    exports.default = on;
    function once(target, type, listener, capture) {
        // FIXME
        // tslint:disable-next-line:no-var-keyword
        var handle = on(target, type, function () {
            handle.destroy();
            return listener.apply(this, arguments);
        }, capture);
        return handle;
    }
    exports.once = once;
    function pausable(target, type, listener, capture) {
        var paused;
        var handle = on(target, type, function () {
            if (!paused) {
                return listener.apply(this, arguments);
            }
        }, capture);
        handle.pause = function () {
            paused = true;
        };
        handle.resume = function () {
            paused = false;
        };
        return handle;
    }
    exports.pausable = pausable;
});
//# sourceMappingURL=on.js.map