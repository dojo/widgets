import { Iterable } from './iterator';
import './Symbol';
export interface Observable<T> extends ObservableObject {
    /**
     * Registers handlers for handling emitted values, error and completions from the observable, and
     * executes the observable's subscriber function, which will take action to set up the underlying data stream.
     *
     * @param observer    The observer object that will handle events
     *
     * @return A Subscription object that can be used to manage the subscription.
     */
    subscribe(observer: Observer<T>): Subscription;
    /**
     * Registers handlers for handling emitted values, error and completions from the observable, and
     * executes the observable's subscriber function, which will take action to set up the underlying data stream.
     *
     * @param onNext A function to handle an emitted value. Value is passed in as the first parameter to the function.
     * @param onError A function to handle errors that occur during onNext, or during subscription.
     * @param onComplete A function that gets called when the subscription is complete, and will not send any more values. This function will also get called if an error occurs and onError is not defined.
     *
     * @return {Subscription} A Subscription object that can be used to manage the subscription.
     */
    subscribe(onNext: (value: T) => any, onError?: (error: any) => any, onComplete?: (completeValue?: any) => void): Subscription;
    [Symbol.observable](): this;
}
export interface ObservableConstructor {
    /**
     * Create a new observerable with a subscriber function. The subscriber function will get called with a
     * SubscriptionObserver parameter for controlling the subscription.  I a function is returned, it will be
     * run when the subscription is complete.
     *
     * @param subscriber The subscription function to be called when observers are subscribed
     *
     * @example
     * ```ts
     * const source = new Observer<number>((observer) => {
     *     observer.next(1);
     *     observer.next(2);
     *     observer.next(3);
     * });
     * ```ts
     */
    new <T>(subscriber: Subscriber<T>): Observable<T>;
    /**
     * Create an Observable from another object. If the object is in itself Observable, the object will be returned.
     * Otherwise, the value will be wrapped in an Observable. If the object is iterable, an Observable will be created
     * that emits each item of the iterable.
     *
     * @param item The item to be turned into an Observable
     * @return An observable for the item you passed in
     */
    from<T>(item: Iterable<T> | ArrayLike<T> | ObservableObject): Observable<T>;
    /**
     * Create an Observable from a list of values.
     *
     * @param items The values to be emitted
     * @return An Observable that will emit the specified values
     *
     * @example
     * ```ts
     * let source = Observable.of(1, 2, 3);
     * // will emit three separate values, 1, 2, and 3.
     * ```
     */
    of<T>(...items: T[]): Observable<T>;
}
/**
 * An object that implements a Symbol.observerable method.
 */
export interface ObservableObject {
    [Symbol.observable]: () => any;
}
/**
 * Handles events emitted from the subscription
 */
export interface Observer<T> {
    /**
     * Called to handle a single emitted event.
     *
     * @param value The value that was emitted.
     */
    next?(value: T): any;
    /**
     * An optional method to be called when the subscription starts (before any events are emitted).
     * @param observer
     */
    start?(observer: Subscription): void;
    /**
     * An optional method to be called if an error occurs during subscription or handling.
     *
     * @param errorValue The error
     */
    error?(errorValue: any): any;
    /**
     * An optional method to be called when the subscription is completed (unless an error occurred and the error method was specified)
     *
     * @param completeValue The value passed to the completion method.
     */
    complete?(completeValue?: any): void;
}
/**
 * Describes an object that can be subscribed to
 */
export interface Subscribable<T> {
    subscribe(observer: Observer<T>): Subscription;
    subscribe(onNext: (value: T) => any, onError?: (error: any) => any, onComplete?: (completeValue?: any) => void): Subscription;
}
export interface Subscriber<T> {
    (observer: SubscriptionObserver<T>): (() => void) | void | {
        unsubscribe: () => void;
    };
}
/**
 * Handles an individual subscription to an Observable.
 */
export interface Subscription {
    /**
     * Whether or not the subscription is closed. Closed subscriptions will not emit values.
     */
    closed: boolean;
    /**
     * A function to call to close the subscription. Calling this will call any associated tear down methods.
     */
    unsubscribe: (() => void);
}
/**
 * An object used to control a single subscription and an observer.
 */
export interface SubscriptionObserver<T> {
    /**
     * Whether or not the subscription is closed.
     */
    readonly closed: boolean;
    /**
     * Emit an event to the observer.
     *
     * @param value The value to be emitted.
     */
    next(value: T): any;
    /**
     * Report an error. The subscription will be closed after an error has occurred.
     *
     * @param errorValue The error to be reported.
     */
    error(errorValue: any): any;
    /**
     * Report completion of the subscription. The subscription will be closed, and no new values will be emitted,
     * after completion.
     *
     * @param completeValue A value to pass to the completion handler.
     */
    complete(completeValue?: any): void;
}
export declare let Observable: ObservableConstructor;
export default Observable;
