import { OperationType } from './Patch';
import { Pointer } from './Pointer';
export function add(path, value) {
    return {
        op: OperationType.ADD,
        path: new Pointer(path.path),
        value
    };
}
export function replace(path, value) {
    return {
        op: OperationType.REPLACE,
        path: new Pointer(path.path),
        value
    };
}
export function remove(path) {
    return {
        op: OperationType.REMOVE,
        path: new Pointer(path.path)
    };
}
export function test(path, value) {
    return {
        op: OperationType.TEST,
        path: new Pointer(path.path),
        value
    };
}
//# sourceMappingURL=operations.mjs.map