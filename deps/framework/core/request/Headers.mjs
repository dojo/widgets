import { ShimIterator } from '../../shim/iterator';
import Map from '../../shim/Map';
function isHeadersLike(object) {
    return (typeof object.append === 'function' &&
        typeof object.entries === 'function' &&
        typeof object[Symbol.iterator] === 'function');
}
export class Headers {
    constructor(headers) {
        this.map = new Map();
        if (headers) {
            if (headers instanceof Headers) {
                this.map = new Map(headers.map);
            }
            else if (isHeadersLike(headers)) {
                for (const [key, value] of headers) {
                    this.append(key, value);
                }
            }
            else {
                for (let key in headers) {
                    this.set(key, headers[key]);
                }
            }
        }
    }
    append(name, value) {
        const values = this.map.get(name.toLowerCase());
        if (values) {
            values.push(value);
        }
        else {
            this.set(name, value);
        }
    }
    delete(name) {
        this.map.delete(name.toLowerCase());
    }
    entries() {
        const entries = [];
        for (const [key, values] of this.map.entries()) {
            values.forEach((value) => {
                entries.push([key, value]);
            });
        }
        return new ShimIterator(entries);
    }
    get(name) {
        const values = this.map.get(name.toLowerCase());
        if (values) {
            return values[0];
        }
        else {
            return null;
        }
    }
    getAll(name) {
        const values = this.map.get(name.toLowerCase());
        if (values) {
            return values.slice(0);
        }
        else {
            return [];
        }
    }
    has(name) {
        return this.map.has(name.toLowerCase());
    }
    keys() {
        return this.map.keys();
    }
    set(name, value) {
        this.map.set(name.toLowerCase(), [value]);
    }
    values() {
        const values = [];
        for (const value of this.map.values()) {
            values.push(...value);
        }
        return new ShimIterator(values);
    }
    [Symbol.iterator]() {
        return this.entries();
    }
}
export default Headers;
//# sourceMappingURL=Headers.mjs.map