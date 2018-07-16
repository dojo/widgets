import { isArrayLike, isIterable, ShimIterator } from '../shim/iterator';
import WeakMap from '../shim/WeakMap';
const listItems = new WeakMap();
function getListItems(list) {
    return (listItems.get(list) || []);
}
export class List {
    constructor(source) {
        listItems.set(this, []);
        if (source) {
            if (isArrayLike(source)) {
                for (let i = 0; i < source.length; i++) {
                    this.add(source[i]);
                }
            }
            else if (isIterable(source)) {
                for (const item of source) {
                    this.add(item);
                }
            }
        }
    }
    [Symbol.iterator]() {
        return this.values();
    }
    get size() {
        return getListItems(this).length;
    }
    add(value) {
        getListItems(this).push(value);
        return this;
    }
    clear() {
        listItems.set(this, []);
    }
    delete(idx) {
        if (idx < this.size) {
            getListItems(this).splice(idx, 1);
            return true;
        }
        return false;
    }
    entries() {
        return new ShimIterator(getListItems(this).map((value, index) => [index, value]));
    }
    forEach(fn, thisArg) {
        getListItems(this).forEach(fn.bind(thisArg ? thisArg : this));
    }
    has(idx) {
        return this.size > idx;
    }
    includes(value) {
        return getListItems(this).indexOf(value) >= 0;
    }
    indexOf(value) {
        return getListItems(this).indexOf(value);
    }
    join(separator = ',') {
        return getListItems(this).join(separator);
    }
    keys() {
        return new ShimIterator(getListItems(this).map((_, index) => index));
    }
    lastIndexOf(value) {
        return getListItems(this).lastIndexOf(value);
    }
    push(value) {
        this.add(value);
    }
    pop() {
        return getListItems(this).pop();
    }
    splice(start, deleteCount, ...newItems) {
        return getListItems(this).splice(start, deleteCount === undefined ? this.size - start : deleteCount, ...newItems);
    }
    values() {
        return new ShimIterator(getListItems(this).map((value) => value));
    }
}
export default List;
//# sourceMappingURL=List.mjs.map