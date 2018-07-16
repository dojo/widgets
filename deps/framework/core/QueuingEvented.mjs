import Map from '../shim/Map';
import Evented, { isGlobMatch } from './Evented';
/**
 * An implementation of the Evented class that queues up events when no listeners are
 * listening. When a listener is subscribed, the queue will be published to the listener.
 * When the queue is full, the oldest events will be discarded to make room for the newest ones.
 *
 * @property maxEvents  The number of events to queue before old events are discarded. If zero (default), an unlimited number of events is queued.
 */
class QueuingEvented extends Evented {
    constructor() {
        super(...arguments);
        this._queue = new Map();
        this.maxEvents = 0;
    }
    emit(event) {
        super.emit(event);
        let hasMatch = false;
        this.listenersMap.forEach((method, type) => {
            // Since `type` is generic, the compiler doesn't know what type it is and `isGlobMatch` requires `string | symbol`
            if (isGlobMatch(type, event.type)) {
                hasMatch = true;
            }
        });
        if (!hasMatch) {
            let queue = this._queue.get(event.type);
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
    }
    on(type, listener) {
        let handle = super.on(type, listener);
        this.listenersMap.forEach((method, listenerType) => {
            this._queue.forEach((events, queuedType) => {
                if (isGlobMatch(listenerType, queuedType)) {
                    events.forEach((event) => this.emit(event));
                    this._queue.delete(queuedType);
                }
            });
        });
        return handle;
    }
}
export default QueuingEvented;
//# sourceMappingURL=QueuingEvented.mjs.map