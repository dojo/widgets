import { RemovePatchOperation, ReplacePatchOperation, AddPatchOperation, TestPatchOperation } from './Patch';
import { Path } from '../Store';
export declare function add<T = any, U = any>(path: Path<T, U>, value: U): AddPatchOperation<T, U>;
export declare function replace<T = any, U = any>(path: Path<T, U>, value: U): ReplacePatchOperation<T, U>;
export declare function remove<T = any, U = any>(path: Path<T, U>): RemovePatchOperation<T, U>;
export declare function test<T = any, U = any>(path: Path<T, U>, value: U): TestPatchOperation<T, U>;
