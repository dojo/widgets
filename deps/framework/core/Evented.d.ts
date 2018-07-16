import Map from '../shim/Map';
import { Handle, EventType, EventObject } from './interfaces';
import { Destroyable } from './Destroyable';
/**
 * Determines is the event type glob has been matched
 *
 * @returns boolean that indicates if the glob is matched
 */
export declare function isGlobMatch(globString: string | symbol, targetString: string | symbol): boolean;
export declare type EventedCallback<T = EventType, E extends EventObject<T> = EventObject<T>> = {
    /**
     * A callback that takes an `event` argument
     *
     * @param event The event object
     */
    (event: E): boolean | void;
};
export interface CustomEventTypes<T extends EventObject<any> = EventObject<any>> {
    [index: string]: T;
}
/**
 * A type which is either a targeted event listener or an array of listeners
 * @template T The type of target for the events
 * @template E The event type for the events
 */
export declare type EventedCallbackOrArray<T = EventType, E extends EventObject<T> = EventObject<T>> = EventedCallback<T, E> | EventedCallback<T, E>[];
/**
 * Event Class
 */
export declare class Evented<M extends CustomEventTypes = {}, T = EventType, O extends EventObject<T> = EventObject<T>> extends Destroyable {
    protected __typeMap__?: M;
    /**
     * map of listeners keyed by event type
     */
    protected listenersMap: Map<T | keyof M, EventedCallback<T, O>[]>;
    /**
     * Emits the event object for the specified type
     *
     * @param event the event to emit
     */
    emit<K extends keyof M>(event: M[K]): void;
    emit(event: O): void;
    /**
     * Catch all handler for various call signatures. The signatures are defined in
     * `BaseEventedEvents`.  You can add your own event type -> handler types by extending
     * `BaseEventedEvents`.  See example for details.
     *
     * @param args
     *
     * @example
     *
     * interface WidgetBaseEvents extends BaseEventedEvents {
     *     (type: 'properties:changed', handler: PropertiesChangedHandler): Handle;
     * }
     * class WidgetBase extends Evented {
     *    on: WidgetBaseEvents;
     * }
     *
     * @return {any}
     */
    on<K extends keyof M>(type: K, listener: EventedCallbackOrArray<K, M[K]>): Handle;
    on(type: T, listener: EventedCallbackOrArray<T, O>): Handle;
    private _addListener(type, listener);
}
export default Evented;
