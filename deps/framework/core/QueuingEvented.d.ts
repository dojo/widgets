import { Handle, EventObject, EventType } from './interfaces';
import Evented, { CustomEventTypes, EventedCallbackOrArray } from './Evented';
/**
 * An implementation of the Evented class that queues up events when no listeners are
 * listening. When a listener is subscribed, the queue will be published to the listener.
 * When the queue is full, the oldest events will be discarded to make room for the newest ones.
 *
 * @property maxEvents  The number of events to queue before old events are discarded. If zero (default), an unlimited number of events is queued.
 */
declare class QueuingEvented<M extends CustomEventTypes = {}, T = EventType, O extends EventObject<T> = EventObject<T>> extends Evented<M, T, O> {
    private _queue;
    maxEvents: number;
    emit<K extends keyof M>(event: M[K]): void;
    emit(event: O): void;
    on<K extends keyof M>(type: K, listener: EventedCallbackOrArray<K, M[K]>): Handle;
    on(type: T, listener: EventedCallbackOrArray<T, O>): Handle;
}
export default QueuingEvented;
