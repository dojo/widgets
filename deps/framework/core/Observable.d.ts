import ObservableShim, { ObservableObject, Subscribable, SubscriptionObserver } from '../shim/Observable';
import { Iterable } from '../shim/iterator';
export default class Observable<T> extends ObservableShim<T> {
    static of<T>(...items: T[]): Observable<T>;
    static from<T>(item: Iterable<T> | ArrayLike<T> | ObservableObject): Observable<T>;
    static defer<T>(deferFunction: () => Subscribable<T>): Observable<T>;
    toPromise(): Promise<T>;
    map<U>(mapFunction: (x: T) => U): Observable<U>;
    filter(filterFunction: (x: T) => boolean): Observable<T>;
    toArray(): Observable<T[]>;
    mergeAll(concurrent: number): Observable<any>;
}
export { Observable, Subscribable, SubscriptionObserver as Observer };
