import global from './global';
import { isArrayLike, ShimIterator } from './iterator';
import has from './support/has';
import './Symbol';
export let Set = global.Set;
if (!has('es6-set')) {
    Set = (_a = class Set {
            constructor(iterable) {
                this._setData = [];
                this[Symbol.toStringTag] = 'Set';
                if (iterable) {
                    if (isArrayLike(iterable)) {
                        for (let i = 0; i < iterable.length; i++) {
                            this.add(iterable[i]);
                        }
                    }
                    else {
                        for (const value of iterable) {
                            this.add(value);
                        }
                    }
                }
            }
            add(value) {
                if (this.has(value)) {
                    return this;
                }
                this._setData.push(value);
                return this;
            }
            clear() {
                this._setData.length = 0;
            }
            delete(value) {
                const idx = this._setData.indexOf(value);
                if (idx === -1) {
                    return false;
                }
                this._setData.splice(idx, 1);
                return true;
            }
            entries() {
                return new ShimIterator(this._setData.map((value) => [value, value]));
            }
            forEach(callbackfn, thisArg) {
                const iterator = this.values();
                let result = iterator.next();
                while (!result.done) {
                    callbackfn.call(thisArg, result.value, result.value, this);
                    result = iterator.next();
                }
            }
            has(value) {
                return this._setData.indexOf(value) > -1;
            }
            keys() {
                return new ShimIterator(this._setData);
            }
            get size() {
                return this._setData.length;
            }
            values() {
                return new ShimIterator(this._setData);
            }
            [Symbol.iterator]() {
                return new ShimIterator(this._setData);
            }
        },
        _a[Symbol.species] = _a,
        _a);
}
export default Set;
var _a;
//# sourceMappingURL=Set.mjs.map