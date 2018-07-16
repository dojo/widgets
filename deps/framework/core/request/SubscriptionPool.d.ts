import { SubscriptionObserver } from '../../shim/Observable';
export declare class SubscriptionPool<T> {
    private _observers;
    private _queue;
    private _queueMaxLength;
    constructor(maxLength?: number);
    add(subscription: SubscriptionObserver<T>): () => void;
    next(value: T): void;
    complete(): void;
}
export default SubscriptionPool;
