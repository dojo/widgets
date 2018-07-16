(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../process", "../state/Pointer", "../../shim/WeakMap"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var process_1 = require("../process");
    var Pointer_1 = require("../state/Pointer");
    var WeakMap_1 = require("../../shim/WeakMap");
    var HistoryManager = /** @class */ (function () {
        function HistoryManager() {
            this._storeMap = new WeakMap_1.default();
        }
        HistoryManager.prototype.collector = function (callback) {
            var _this = this;
            return function (error, result) {
                var operations = result.operations, undoOperations = result.undoOperations, id = result.id, store = result.store;
                var _a = _this._storeMap.get(store) || {
                    history: [],
                    undo: []
                }, history = _a.history, undo = _a.undo;
                history.push({ id: id, operations: operations });
                undo.push({ id: id, operations: undoOperations });
                _this._storeMap.set(store, { history: history, undo: undo, redo: [] });
                callback && callback(error, result);
            };
        };
        HistoryManager.prototype.canUndo = function (store) {
            var stacks = this._storeMap.get(store);
            if (stacks) {
                var history_1 = stacks.history, undo = stacks.undo;
                if (undo.length && history_1.length) {
                    return true;
                }
            }
            return false;
        };
        HistoryManager.prototype.canRedo = function (store) {
            var stacks = this._storeMap.get(store);
            if (stacks) {
                var redo = stacks.redo;
                if (redo.length) {
                    return true;
                }
            }
            return false;
        };
        HistoryManager.prototype.redo = function (store) {
            var stacks = this._storeMap.get(store);
            if (stacks) {
                var history_2 = stacks.history, redo = stacks.redo, undo = stacks.undo;
                if (redo.length) {
                    var _a = redo.pop(), id = _a.id, operations = _a.operations;
                    var result = store.apply(operations);
                    history_2.push({ id: id, operations: operations });
                    undo.push({ id: id, operations: result });
                    this._storeMap.set(store, { history: history_2, undo: undo, redo: redo });
                }
            }
        };
        HistoryManager.prototype.undo = function (store) {
            var stacks = this._storeMap.get(store);
            if (stacks) {
                var history_3 = stacks.history, undo = stacks.undo, redo = stacks.redo;
                if (undo.length && history_3.length) {
                    var _a = undo.pop(), id = _a.id, operations = _a.operations;
                    history_3.pop();
                    var result = store.apply(operations);
                    redo.push({ id: id, operations: result });
                    this._storeMap.set(store, { history: history_3, undo: undo, redo: redo });
                }
            }
        };
        HistoryManager.prototype.deserialize = function (store, data) {
            var history = data.history, redo = data.redo;
            history.forEach(function (_a) {
                var id = _a.id, operations = _a.operations;
                operations = operations.map(function (operation) {
                    operation.path = new Pointer_1.Pointer(String(operation.path));
                    return operation;
                });
                var callback;
                var process = process_1.getProcess(id);
                if (process) {
                    callback = process[2];
                }
                process_1.processExecutor(id, [function () { return operations; }], store, callback, undefined)({});
            });
            var stacks = this._storeMap.get(store);
            redo.forEach(function (_a) {
                var id = _a.id, operations = _a.operations;
                operations = operations.map(function (operation) {
                    operation.path = new Pointer_1.Pointer(String(operation.path));
                    return operation;
                });
            });
            stacks.redo = redo;
        };
        HistoryManager.prototype.serialize = function (store) {
            var stacks = this._storeMap.get(store);
            if (stacks) {
                return {
                    history: stacks.history,
                    redo: stacks.redo
                };
            }
            return { history: [], redo: [] };
        };
        return HistoryManager;
    }());
    exports.HistoryManager = HistoryManager;
    exports.default = HistoryManager;
});
//# sourceMappingURL=HistoryManager.js.map