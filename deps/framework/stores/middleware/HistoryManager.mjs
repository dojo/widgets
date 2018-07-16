import { processExecutor, getProcess } from '../process';
import { Pointer } from '../state/Pointer';
import WeakMap from '../../shim/WeakMap';
export class HistoryManager {
    constructor() {
        this._storeMap = new WeakMap();
    }
    collector(callback) {
        return (error, result) => {
            const { operations, undoOperations, id, store } = result;
            const { history, undo } = this._storeMap.get(store) || {
                history: [],
                undo: []
            };
            history.push({ id, operations });
            undo.push({ id, operations: undoOperations });
            this._storeMap.set(store, { history, undo, redo: [] });
            callback && callback(error, result);
        };
    }
    canUndo(store) {
        const stacks = this._storeMap.get(store);
        if (stacks) {
            const { history, undo } = stacks;
            if (undo.length && history.length) {
                return true;
            }
        }
        return false;
    }
    canRedo(store) {
        const stacks = this._storeMap.get(store);
        if (stacks) {
            const { redo } = stacks;
            if (redo.length) {
                return true;
            }
        }
        return false;
    }
    redo(store) {
        const stacks = this._storeMap.get(store);
        if (stacks) {
            const { history, redo, undo } = stacks;
            if (redo.length) {
                const { id, operations } = redo.pop();
                const result = store.apply(operations);
                history.push({ id, operations });
                undo.push({ id, operations: result });
                this._storeMap.set(store, { history, undo, redo });
            }
        }
    }
    undo(store) {
        const stacks = this._storeMap.get(store);
        if (stacks) {
            const { history, undo, redo } = stacks;
            if (undo.length && history.length) {
                const { id, operations } = undo.pop();
                history.pop();
                const result = store.apply(operations);
                redo.push({ id, operations: result });
                this._storeMap.set(store, { history, undo, redo });
            }
        }
    }
    deserialize(store, data) {
        const { history, redo } = data;
        history.forEach(({ id, operations }) => {
            operations = operations.map((operation) => {
                operation.path = new Pointer(String(operation.path));
                return operation;
            });
            let callback;
            const process = getProcess(id);
            if (process) {
                callback = process[2];
            }
            processExecutor(id, [() => operations], store, callback, undefined)({});
        });
        const stacks = this._storeMap.get(store);
        redo.forEach(({ id, operations }) => {
            operations = operations.map((operation) => {
                operation.path = new Pointer(String(operation.path));
                return operation;
            });
        });
        stacks.redo = redo;
    }
    serialize(store) {
        const stacks = this._storeMap.get(store);
        if (stacks) {
            return {
                history: stacks.history,
                redo: stacks.redo
            };
        }
        return { history: [], redo: [] };
    }
}
export default HistoryManager;
//# sourceMappingURL=HistoryManager.mjs.map