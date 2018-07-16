import { Pointer } from './Pointer';
export declare enum OperationType {
    ADD = "add",
    REMOVE = "remove",
    REPLACE = "replace",
    TEST = "test",
}
export interface BaseOperation<T = any, U = any> {
    op: OperationType;
    path: Pointer<T, U>;
}
export interface AddPatchOperation<T = any, U = any> extends BaseOperation<T, U> {
    op: OperationType.ADD;
    value: U;
}
export interface RemovePatchOperation<T = any, U = any> extends BaseOperation<T, U> {
    op: OperationType.REMOVE;
}
export interface ReplacePatchOperation<T = any, U = any> extends BaseOperation<T, U> {
    op: OperationType.REPLACE;
    value: U;
}
export interface TestPatchOperation<T = any, U = any> extends BaseOperation<T, U> {
    op: OperationType.TEST;
    value: U;
}
export declare type PatchOperation<T = any, U = any> = AddPatchOperation<T, U> | RemovePatchOperation<T, U> | ReplacePatchOperation<T, U> | TestPatchOperation<T, U>;
export interface PatchResult<T = any, U = any> {
    object: T;
    undoOperations: PatchOperation<T, U>[];
}
export declare function isObject(value: any): value is Object;
export declare function isEqual(a: any, b: any): boolean;
export declare class Patch<T = any> {
    private _operations;
    constructor(operations: PatchOperation<T> | PatchOperation<T>[]);
    apply(object: any): PatchResult<T>;
}
