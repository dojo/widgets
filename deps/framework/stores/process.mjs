import * as tslib_1 from "tslib";
import { isThenable } from '../shim/Promise';
import Map from '../shim/Map';
/**
 * Creates a command factory with the specified type
 */
export function createCommandFactory() {
    return (command) => command;
}
const processMap = new Map();
export function getProcess(id) {
    return processMap.get(id);
}
export function processExecutor(id, commands, store, callback, transformer) {
    const { apply, get, path, at } = store;
    function executor(process, payload, transformer) {
        return process(store)(payload);
    }
    return (executorPayload) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const operations = [];
        const commandsCopy = [...commands];
        let undoOperations = [];
        let command = commandsCopy.shift();
        let error = null;
        const payload = transformer ? transformer(executorPayload) : executorPayload;
        try {
            while (command) {
                let results = [];
                if (Array.isArray(command)) {
                    results = command.map((commandFunction) => commandFunction({ at, get, path, payload }));
                    results = yield Promise.all(results);
                }
                else {
                    let result = command({ at, get, path, payload });
                    if (isThenable(result)) {
                        result = yield result;
                    }
                    results = [result];
                }
                for (let i = 0; i < results.length; i++) {
                    operations.push(...results[i]);
                    undoOperations = [...apply(results[i]), ...undoOperations];
                }
                store.invalidate();
                command = commandsCopy.shift();
            }
        }
        catch (e) {
            error = { error: e, command };
        }
        callback &&
            callback(error, {
                undoOperations,
                store,
                id,
                operations,
                apply,
                at,
                get,
                path,
                executor,
                payload
            });
        return Promise.resolve({
            store,
            undoOperations,
            id,
            error,
            operations,
            apply,
            at,
            get,
            path,
            executor,
            payload
        });
    });
}
/**
 * Factories a process using the provided commands and an optional callback. Returns an executor used to run the process.
 *
 * @param commands The commands for the process
 * @param callback Callback called after the process is completed
 */
export function createProcess(id, commands, callback) {
    processMap.set(id, [id, commands, callback]);
    return (store, transformer) => processExecutor(id, commands, store, callback, transformer);
}
/**
 * Creates a process factory that will create processes with the specified callback decorators applied.
 * @param callbackDecorators array of process callback decorators to be used by the return factory.
 */
export function createProcessFactoryWith(callbackDecorators) {
    return (id, commands, callback) => {
        const decoratedCallback = callbackDecorators.reduce((callback, callbackDecorator) => {
            return callbackDecorator(callback);
        }, callback);
        return createProcess(id, commands, decoratedCallback);
    };
}
/**
 * Creates a `ProcessCallbackDecorator` from a `ProcessCallback`.
 * @param processCallback the process callback to convert to a decorator.
 */
export function createCallbackDecorator(processCallback) {
    return (previousCallback) => {
        return (error, result) => {
            processCallback(error, result);
            previousCallback && previousCallback(error, result);
        };
    };
}
//# sourceMappingURL=process.mjs.map