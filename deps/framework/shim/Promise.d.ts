import './Symbol';
/**
 * Executor is the interface for functions used to initialize a Promise.
 */
export interface Executor<T> {
    /**
     * The executor for the promise
     *
     * @param resolve The resolver callback of the promise
     * @param reject The rejector callback of the promise
     */
    (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void): void;
}
export declare let ShimPromise: typeof Promise;
export declare const isThenable: <T>(value: any) => value is PromiseLike<T>;
export default ShimPromise;
