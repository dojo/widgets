import { Handle, EventObject } from './interfaces';
import Evented, { CustomEventTypes } from './Evented';
export interface EventCallback<O = EventObject<string>> {
    (event: O): void;
}
export interface EventEmitter {
    on(event: string, listener: EventCallback): EventEmitter;
    removeListener(event: string, listener: EventCallback): EventEmitter;
}
/**
 * Provides a normalized mechanism for dispatching events for event emitters, Evented objects, or DOM nodes.
 * @param target The target to emit the event from
 * @param event The event object to emit
 * @return Boolean indicating if preventDefault was called on the event object (only relevant for DOM events;
 *     always false for other event emitters)
 */
export declare function emit<M extends CustomEventTypes, T, O extends EventObject<T> = EventObject<T>, K extends keyof M = keyof M>(target: Evented<M, T, O>, event: M[K]): boolean;
export declare function emit<T, O extends EventObject<T> = EventObject<T>>(target: Evented<any, T, O>, event: O): boolean;
export declare function emit<O extends EventObject<string> = EventObject<string>>(target: EventTarget | EventEmitter, event: O): boolean;
/**
 * Provides a normalized mechanism for listening to events from event emitters, Evented objects, or DOM nodes.
 * @param target Target to listen for event on
 * @param type Event event type(s) to listen for; may a string or an array of strings
 * @param listener Callback to handle the event when it fires
 * @param capture Whether the listener should be registered in the capture phase (DOM events only)
 * @return A handle which will remove the listener when destroy is called
 */
export default function on<M extends CustomEventTypes, T, K extends keyof M = keyof M, O extends EventObject<T> = EventObject<T>>(target: Evented<M, T, O>, type: K | K[], listener: EventCallback<M[K]>): Handle;
export default function on<T, O extends EventObject<T> = EventObject<T>>(target: Evented<any, T, O>, type: T | T[], listener: EventCallback<O>): Handle;
export default function on(target: EventEmitter, type: string | string[], listener: EventCallback): Handle;
export default function on(target: EventTarget, type: string | string[], listener: EventCallback, capture?: boolean): Handle;
/**
 * Provides a mechanism for listening to the next occurrence of an event from event
 * emitters, Evented objects, or DOM nodes.
 * @param target Target to listen for event on
 * @param type Event event type(s) to listen for; may be a string or an array of strings
 * @param listener Callback to handle the event when it fires
 * @param capture Whether the listener should be registered in the capture phase (DOM events only)
 * @return A handle which will remove the listener when destroy is called
 */
export declare function once<M extends CustomEventTypes, T, K extends keyof M = keyof M, O extends EventObject<T> = EventObject<T>>(target: Evented<M, T, O>, type: K | K[], listener: EventCallback<M[K]>): Handle;
export declare function once<T, O extends EventObject<T> = EventObject<T>>(target: Evented<any, T, O>, type: T | T[], listener: EventCallback<O>): Handle;
export declare function once(target: EventTarget, type: string | string[], listener: EventCallback, capture?: boolean): Handle;
export declare function once(target: EventEmitter, type: string | string[], listener: EventCallback): Handle;
export interface PausableHandle extends Handle {
    pause(): void;
    resume(): void;
}
/**
 * Provides a mechanism for creating pausable listeners for events from event emitters, Evented objects, or DOM nodes.
 * @param target Target to listen for event on
 * @param type Event event type(s) to listen for; may a string or an array of strings
 * @param listener Callback to handle the event when it fires
 * @param capture Whether the listener should be registered in the capture phase (DOM events only)
 * @return A handle with additional pause and resume methods; the listener will never fire when paused
 */
export declare function pausable<M extends CustomEventTypes, T, K extends keyof M = keyof M, O extends EventObject<T> = EventObject<T>>(target: Evented<M, T, O>, type: K | K[], listener: EventCallback<M[K]>): PausableHandle;
export declare function pausable<T, O extends EventObject<T> = EventObject<T>>(target: Evented<any, T, O>, type: T | T[], listener: EventCallback<O>): PausableHandle;
export declare function pausable(target: EventTarget, type: string | string[], listener: EventCallback, capture?: boolean): PausableHandle;
export declare function pausable(target: EventEmitter, type: string | string[], listener: EventCallback): PausableHandle;
