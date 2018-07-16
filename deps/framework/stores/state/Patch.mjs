import { walk } from './Pointer';
export var OperationType;
(function (OperationType) {
    OperationType["ADD"] = "add";
    OperationType["REMOVE"] = "remove";
    OperationType["REPLACE"] = "replace";
    OperationType["TEST"] = "test";
})(OperationType || (OperationType = {}));
function add(pointerTarget, value) {
    if (Array.isArray(pointerTarget.target)) {
        pointerTarget.target.splice(parseInt(pointerTarget.segment, 10), 0, value);
    }
    else {
        pointerTarget.target[pointerTarget.segment] = value;
    }
    return pointerTarget.object;
}
function replace(pointerTarget, value) {
    if (Array.isArray(pointerTarget.target)) {
        pointerTarget.target.splice(parseInt(pointerTarget.segment, 10), 1, value);
    }
    else {
        pointerTarget.target[pointerTarget.segment] = value;
    }
    return pointerTarget.object;
}
function remove(pointerTarget) {
    if (Array.isArray(pointerTarget.target)) {
        pointerTarget.target.splice(parseInt(pointerTarget.segment, 10), 1);
    }
    else {
        delete pointerTarget.target[pointerTarget.segment];
    }
    return pointerTarget.object;
}
function test(pointerTarget, value) {
    return isEqual(pointerTarget.target[pointerTarget.segment], value);
}
export function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}
export function isEqual(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((element, i) => isEqual(element, b[i]));
    }
    else if (isObject(a) && isObject(b)) {
        const keysForA = Object.keys(a).sort();
        const keysForB = Object.keys(b).sort();
        return isEqual(keysForA, keysForB) && keysForA.every((key) => isEqual(a[key], b[key]));
    }
    else {
        return a === b;
    }
}
function inverse(operation, state) {
    if (operation.op === OperationType.ADD) {
        const op = {
            op: OperationType.REMOVE,
            path: operation.path
        };
        const test = {
            op: OperationType.TEST,
            path: operation.path,
            value: operation.value
        };
        return [test, op];
    }
    else if (operation.op === OperationType.REPLACE) {
        const value = operation.path.get(state);
        let op;
        if (value === undefined) {
            op = {
                op: OperationType.REMOVE,
                path: operation.path
            };
        }
        else {
            op = {
                op: OperationType.REPLACE,
                path: operation.path,
                value: operation.path.get(state)
            };
        }
        const test = {
            op: OperationType.TEST,
            path: operation.path,
            value: operation.value
        };
        return [test, op];
    }
    else {
        return [
            {
                op: OperationType.ADD,
                path: operation.path,
                value: operation.path.get(state)
            }
        ];
    }
}
export class Patch {
    constructor(operations) {
        this._operations = Array.isArray(operations) ? operations : [operations];
    }
    apply(object) {
        let undoOperations = [];
        const patchedObject = this._operations.reduce((patchedObject, next) => {
            let object;
            const pointerTarget = walk(next.path.segments, patchedObject);
            switch (next.op) {
                case OperationType.ADD:
                    object = add(pointerTarget, next.value);
                    break;
                case OperationType.REPLACE:
                    object = replace(pointerTarget, next.value);
                    break;
                case OperationType.REMOVE:
                    object = remove(pointerTarget);
                    break;
                case OperationType.TEST:
                    const result = test(pointerTarget, next.value);
                    if (!result) {
                        throw new Error('Test operation failure. Unable to apply any operations.');
                    }
                    return patchedObject;
                default:
                    throw new Error('Unknown operation');
            }
            undoOperations = [...inverse(next, patchedObject), ...undoOperations];
            return object;
        }, object);
        return { object: patchedObject, undoOperations };
    }
}
//# sourceMappingURL=Patch.mjs.map