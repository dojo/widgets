import { Evented } from '../core/Evented';
import { EventObject } from '../core/interfaces';
export declare type InjectorEventMap = {
    invalidate: EventObject<'invalidate'>;
};
export declare class Injector<T = any> extends Evented<InjectorEventMap> {
    private _payload;
    private _invalidator;
    constructor(payload: T);
    setInvalidator(invalidator: () => void): void;
    get(): T;
    set(payload: T): void;
}
export default Injector;
