export declare function decode(segment: string): string;
export interface PointerTarget {
    object: any;
    target: any;
    segment: string;
}
export declare function walk(segments: string[], object: any, clone?: boolean, continueOnUndefined?: boolean): PointerTarget;
export declare class Pointer<T = any, U = any> {
    private readonly _segments;
    constructor(segments: string | string[]);
    readonly segments: string[];
    readonly path: string;
    get(object: T): U;
    toJSON(): string;
    toString(): string;
}
