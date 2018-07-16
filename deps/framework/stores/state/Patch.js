(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Pointer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Pointer_1 = require("./Pointer");
    var OperationType;
    (function (OperationType) {
        OperationType["ADD"] = "add";
        OperationType["REMOVE"] = "remove";
        OperationType["REPLACE"] = "replace";
        OperationType["TEST"] = "test";
    })(OperationType = exports.OperationType || (exports.OperationType = {}));
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
    function isObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }
    exports.isObject = isObject;
    function isEqual(a, b) {
        if (Array.isArray(a) && Array.isArray(b)) {
            return a.length === b.length && a.every(function (element, i) { return isEqual(element, b[i]); });
        }
        else if (isObject(a) && isObject(b)) {
            var keysForA = Object.keys(a).sort();
            var keysForB = Object.keys(b).sort();
            return isEqual(keysForA, keysForB) && keysForA.every(function (key) { return isEqual(a[key], b[key]); });
        }
        else {
            return a === b;
        }
    }
    exports.isEqual = isEqual;
    function inverse(operation, state) {
        if (operation.op === OperationType.ADD) {
            var op = {
                op: OperationType.REMOVE,
                path: operation.path
            };
            var test_1 = {
                op: OperationType.TEST,
                path: operation.path,
                value: operation.value
            };
            return [test_1, op];
        }
        else if (operation.op === OperationType.REPLACE) {
            var value = operation.path.get(state);
            var op = void 0;
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
            var test_2 = {
                op: OperationType.TEST,
                path: operation.path,
                value: operation.value
            };
            return [test_2, op];
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
    var Patch = /** @class */ (function () {
        function Patch(operations) {
            this._operations = Array.isArray(operations) ? operations : [operations];
        }
        Patch.prototype.apply = function (object) {
            var undoOperations = [];
            var patchedObject = this._operations.reduce(function (patchedObject, next) {
                var object;
                var pointerTarget = Pointer_1.walk(next.path.segments, patchedObject);
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
                        var result = test(pointerTarget, next.value);
                        if (!result) {
                            throw new Error('Test operation failure. Unable to apply any operations.');
                        }
                        return patchedObject;
                    default:
                        throw new Error('Unknown operation');
                }
                undoOperations = tslib_1.__spread(inverse(next, patchedObject), undoOperations);
                return object;
            }, object);
            return { object: patchedObject, undoOperations: undoOperations };
        };
        return Patch;
    }());
    exports.Patch = Patch;
});
//# sourceMappingURL=Patch.js.map