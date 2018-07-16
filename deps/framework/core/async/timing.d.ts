import Promise from './ExtensiblePromise';
import { Thenable } from '../../shim/interfaces';
export declare type IdentityValue<T> = T | (() => T | Thenable<T>);
export interface Identity<T> {
    (value?: IdentityValue<T>): Promise<T>;
}
/**
 * Used for delaying a Promise chain for a specific number of milliseconds.
 *
 * @param milliseconds the number of milliseconds to delay
 * @return {function (value: T | (() => T | Thenable<T>)): Promise<T>} a function producing a promise that eventually returns the value or executes the value function passed to it; usable with Thenable.then()
 */
export declare function delay<T>(milliseconds: number): Identity<T>;
/**
 * Reject a promise chain if a result hasn't been found before the timeout
 *
 * @param milliseconds after this number of milliseconds a rejection will be returned
 * @param reason The reason for the rejection
 * @return {function(T): Promise<T>} a function that produces a promise that is rejected or resolved based on your timeout
 */
export declare function timeout<T>(milliseconds: number, reason: Error): Identity<T>;
/**
 * A Promise that will reject itself automatically after a time.
 * Useful for combining with other promises in Promise.race.
 */
export declare class DelayedRejection extends Promise<any> {
    /**
     * @param milliseconds the number of milliseconds to wait before triggering a rejection
     * @param reason the reason for the rejection
     */
    constructor(milliseconds: number, reason?: Error);
}
