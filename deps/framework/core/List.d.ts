import { Iterable, IterableIterator } from '../shim/iterator';
export declare class List<T> {
    [Symbol.iterator](): IterableIterator<T>;
    readonly size: number;
    constructor(source?: Iterable<T> | ArrayLike<T>);
    add(value: T): this;
    clear(): void;
    delete(idx: number): boolean;
    entries(): IterableIterator<[number, T]>;
    forEach(fn: (value: T, idx: number, list: this) => void, thisArg?: any): void;
    has(idx: number): boolean;
    includes(value: T): boolean;
    indexOf(value: T): number;
    join(separator?: string): string;
    keys(): IterableIterator<number>;
    lastIndexOf(value: T): number;
    push(value: T): void;
    pop(): T | undefined;
    splice(start: number, deleteCount?: number, ...newItems: T[]): T[];
    values(): IterableIterator<T>;
}
export default List;
