export class SubscriptionPool {
    constructor(maxLength = 10) {
        this._observers = [];
        this._queue = [];
        this._queueMaxLength = maxLength;
    }
    add(subscription) {
        this._observers.push(subscription);
        while (this._queue.length > 0) {
            this.next(this._queue.shift());
        }
        return () => {
            this._observers.splice(this._observers.indexOf(subscription), 1);
        };
    }
    next(value) {
        if (this._observers.length === 0) {
            this._queue.push(value);
            // when the queue is full, get rid of the first ones
            while (this._queue.length > this._queueMaxLength) {
                this._queue.shift();
            }
        }
        this._observers.forEach((observer) => {
            observer.next(value);
        });
    }
    complete() {
        this._observers.forEach((observer) => {
            observer.complete();
        });
    }
}
export default SubscriptionPool;
//# sourceMappingURL=SubscriptionPool.mjs.map