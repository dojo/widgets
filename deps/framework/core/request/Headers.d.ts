import { Headers as HeadersInterface } from './interfaces';
import { IterableIterator } from '../../shim/iterator';
import Map from '../../shim/Map';
export declare class Headers implements HeadersInterface {
    protected map: Map<string, string[]>;
    constructor(headers?: {
        [key: string]: string;
    } | HeadersInterface);
    append(name: string, value: string): void;
    delete(name: string): void;
    entries(): IterableIterator<[string, string]>;
    get(name: string): string | null;
    getAll(name: string): string[];
    has(name: string): boolean;
    keys(): IterableIterator<string>;
    set(name: string, value: string): void;
    values(): IterableIterator<string>;
    [Symbol.iterator](): IterableIterator<[string, string]>;
}
export default Headers;
