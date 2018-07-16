import { createHandle, createCompositeHandle } from './lang';
export function emit(target, event) {
    if (target.dispatchEvent /* includes window and document */ &&
        ((target.ownerDocument && target.ownerDocument.createEvent) /* matches nodes */ ||
            (target.document && target.document.createEvent) /* matches window */ ||
            target.createEvent) /* matches document */) {
        const nativeEvent = (target.ownerDocument || target.document || target).createEvent('HTMLEvents');
        nativeEvent.initEvent(event.type, Boolean(event.bubbles), Boolean(event.cancelable));
        for (let key in event) {
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
export default function on(target, type, listener, capture) {
    if (Array.isArray(type)) {
        let handles = type.map(function (type) {
            return on(target, type, listener, capture);
        });
        return createCompositeHandle(...handles);
    }
    const callback = function () {
        listener.apply(this, arguments);
    };
    // DOM EventTarget
    if (target.addEventListener && target.removeEventListener) {
        target.addEventListener(type, callback, capture);
        return createHandle(function () {
            target.removeEventListener(type, callback, capture);
        });
    }
    if (target.on) {
        // EventEmitter
        if (target.removeListener) {
            target.on(type, callback);
            return createHandle(function () {
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
export function once(target, type, listener, capture) {
    // FIXME
    // tslint:disable-next-line:no-var-keyword
    var handle = on(target, type, function () {
        handle.destroy();
        return listener.apply(this, arguments);
    }, capture);
    return handle;
}
export function pausable(target, type, listener, capture) {
    let paused;
    const handle = on(target, type, function () {
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
//# sourceMappingURL=on.mjs.map