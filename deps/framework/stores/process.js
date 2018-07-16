(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/Promise", "../shim/Map"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Promise_1 = require("../shim/Promise");
    var Map_1 = require("../shim/Map");
    /**
     * Creates a command factory with the specified type
     */
    function createCommandFactory() {
        return function (command) { return command; };
    }
    exports.createCommandFactory = createCommandFactory;
    var processMap = new Map_1.default();
    function getProcess(id) {
        return processMap.get(id);
    }
    exports.getProcess = getProcess;
    function processExecutor(id, commands, store, callback, transformer) {
        var _this = this;
        var apply = store.apply, get = store.get, path = store.path, at = store.at;
        function executor(process, payload, transformer) {
            return process(store)(payload);
        }
        return function (executorPayload) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var operations, commandsCopy, undoOperations, command, error, payload, results, result, i, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        operations = [];
                        commandsCopy = tslib_1.__spread(commands);
                        undoOperations = [];
                        command = commandsCopy.shift();
                        error = null;
                        payload = transformer ? transformer(executorPayload) : executorPayload;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        _a.label = 2;
                    case 2:
                        if (!command) return [3 /*break*/, 8];
                        results = [];
                        if (!Array.isArray(command)) return [3 /*break*/, 4];
                        results = command.map(function (commandFunction) { return commandFunction({ at: at, get: get, path: path, payload: payload }); });
                        return [4 /*yield*/, Promise.all(results)];
                    case 3:
                        results = _a.sent();
                        return [3 /*break*/, 7];
                    case 4:
                        result = command({ at: at, get: get, path: path, payload: payload });
                        if (!Promise_1.isThenable(result)) return [3 /*break*/, 6];
                        return [4 /*yield*/, result];
                    case 5:
                        result = _a.sent();
                        _a.label = 6;
                    case 6:
                        results = [result];
                        _a.label = 7;
                    case 7:
                        for (i = 0; i < results.length; i++) {
                            operations.push.apply(operations, tslib_1.__spread(results[i]));
                            undoOperations = tslib_1.__spread(apply(results[i]), undoOperations);
                        }
                        store.invalidate();
                        command = commandsCopy.shift();
                        return [3 /*break*/, 2];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_1 = _a.sent();
                        error = { error: e_1, command: command };
                        return [3 /*break*/, 10];
                    case 10:
                        callback &&
                            callback(error, {
                                undoOperations: undoOperations,
                                store: store,
                                id: id,
                                operations: operations,
                                apply: apply,
                                at: at,
                                get: get,
                                path: path,
                                executor: executor,
                                payload: payload
                            });
                        return [2 /*return*/, Promise.resolve({
                                store: store,
                                undoOperations: undoOperations,
                                id: id,
                                error: error,
                                operations: operations,
                                apply: apply,
                                at: at,
                                get: get,
                                path: path,
                                executor: executor,
                                payload: payload
                            })];
                }
            });
        }); };
    }
    exports.processExecutor = processExecutor;
    /**
     * Factories a process using the provided commands and an optional callback. Returns an executor used to run the process.
     *
     * @param commands The commands for the process
     * @param callback Callback called after the process is completed
     */
    function createProcess(id, commands, callback) {
        processMap.set(id, [id, commands, callback]);
        return function (store, transformer) {
            return processExecutor(id, commands, store, callback, transformer);
        };
    }
    exports.createProcess = createProcess;
    /**
     * Creates a process factory that will create processes with the specified callback decorators applied.
     * @param callbackDecorators array of process callback decorators to be used by the return factory.
     */
    function createProcessFactoryWith(callbackDecorators) {
        return function (id, commands, callback) {
            var decoratedCallback = callbackDecorators.reduce(function (callback, callbackDecorator) {
                return callbackDecorator(callback);
            }, callback);
            return createProcess(id, commands, decoratedCallback);
        };
    }
    exports.createProcessFactoryWith = createProcessFactoryWith;
    /**
     * Creates a `ProcessCallbackDecorator` from a `ProcessCallback`.
     * @param processCallback the process callback to convert to a decorator.
     */
    function createCallbackDecorator(processCallback) {
        return function (previousCallback) {
            return function (error, result) {
                processCallback(error, result);
                previousCallback && previousCallback(error, result);
            };
        };
    }
    exports.createCallbackDecorator = createCallbackDecorator;
});
//# sourceMappingURL=process.js.map