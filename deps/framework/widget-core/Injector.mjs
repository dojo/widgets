import { Evented } from '../core/Evented';
export class Injector extends Evented {
    constructor(payload) {
        super();
        this._payload = payload;
    }
    setInvalidator(invalidator) {
        this._invalidator = invalidator;
    }
    get() {
        return this._payload;
    }
    set(payload) {
        this._payload = payload;
        if (this._invalidator) {
            this._invalidator();
        }
    }
}
export default Injector;
//# sourceMappingURL=Injector.mjs.map