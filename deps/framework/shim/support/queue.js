(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../global", "./has"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var global_1 = require("../global");
    var has_1 = require("./has");
    function executeTask(item) {
        if (item && item.isActive && item.callback) {
            item.callback();
        }
    }
    function getQueueHandle(item, destructor) {
        return {
            destroy: function () {
                this.destroy = function () { };
                item.isActive = false;
                item.callback = null;
                if (destructor) {
                    destructor();
                }
            }
        };
    }
    var checkMicroTaskQueue;
    var microTasks;
    /**
     * Schedules a callback to the macrotask queue.
     *
     * @param callback the function to be queued and later executed.
     * @returns An object with a `destroy` method that, when called, prevents the registered callback from executing.
     */
    exports.queueTask = (function () {
        var destructor;
        var enqueue;
        // Since the IE implementation of `setImmediate` is not flawless, we will test for `postMessage` first.
        if (has_1.default('postmessage')) {
            var queue_1 = [];
            global_1.default.addEventListener('message', function (event) {
                // Confirm that the event was triggered by the current window and by this particular implementation.
                if (event.source === global_1.default && event.data === 'dojo-queue-message') {
                    event.stopPropagation();
                    if (queue_1.length) {
                        executeTask(queue_1.shift());
                    }
                }
            });
            enqueue = function (item) {
                queue_1.push(item);
                global_1.default.postMessage('dojo-queue-message', '*');
            };
        }
        else if (has_1.default('setimmediate')) {
            destructor = global_1.default.clearImmediate;
            enqueue = function (item) {
                return setImmediate(executeTask.bind(null, item));
            };
        }
        else {
            destructor = global_1.default.clearTimeout;
            enqueue = function (item) {
                return setTimeout(executeTask.bind(null, item), 0);
            };
        }
        function queueTask(callback) {
            var item = {
                isActive: true,
                callback: callback
            };
            var id = enqueue(item);
            return getQueueHandle(item, destructor &&
                function () {
                    destructor(id);
                });
        }
        // TODO: Use aspect.before when it is available.
        return has_1.default('microtasks')
            ? queueTask
            : function (callback) {
                checkMicroTaskQueue();
                return queueTask(callback);
            };
    })();
    // When no mechanism for registering microtasks is exposed by the environment, microtasks will
    // be queued and then executed in a single macrotask before the other macrotasks are executed.
    if (!has_1.default('microtasks')) {
        var isMicroTaskQueued_1 = false;
        microTasks = [];
        checkMicroTaskQueue = function () {
            if (!isMicroTaskQueued_1) {
                isMicroTaskQueued_1 = true;
                exports.queueTask(function () {
                    isMicroTaskQueued_1 = false;
                    if (microTasks.length) {
                        var item = void 0;
                        while ((item = microTasks.shift())) {
                            executeTask(item);
                        }
                    }
                });
            }
        };
    }
    /**
     * Schedules an animation task with `window.requestAnimationFrame` if it exists, or with `queueTask` otherwise.
     *
     * Since requestAnimationFrame's behavior does not match that expected from `queueTask`, it is not used there.
     * However, at times it makes more sense to delegate to requestAnimationFrame; hence the following method.
     *
     * @param callback the function to be queued and later executed.
     * @returns An object with a `destroy` method that, when called, prevents the registered callback from executing.
     */
    exports.queueAnimationTask = (function () {
        if (!has_1.default('raf')) {
            return exports.queueTask;
        }
        function queueAnimationTask(callback) {
            var item = {
                isActive: true,
                callback: callback
            };
            var rafId = requestAnimationFrame(executeTask.bind(null, item));
            return getQueueHandle(item, function () {
                cancelAnimationFrame(rafId);
            });
        }
        // TODO: Use aspect.before when it is available.
        return has_1.default('microtasks')
            ? queueAnimationTask
            : function (callback) {
                checkMicroTaskQueue();
                return queueAnimationTask(callback);
            };
    })();
    /**
     * Schedules a callback to the microtask queue.
     *
     * Any callbacks registered with `queueMicroTask` will be executed before the next macrotask. If no native
     * mechanism for scheduling macrotasks is exposed, then any callbacks will be fired before any macrotask
     * registered with `queueTask` or `queueAnimationTask`.
     *
     * @param callback the function to be queued and later executed.
     * @returns An object with a `destroy` method that, when called, prevents the registered callback from executing.
     */
    exports.queueMicroTask = (function () {
        var enqueue;
        if (has_1.default('host-node')) {
            enqueue = function (item) {
                global_1.default.process.nextTick(executeTask.bind(null, item));
            };
        }
        else if (has_1.default('es6-promise')) {
            enqueue = function (item) {
                global_1.default.Promise.resolve(item).then(executeTask);
            };
        }
        else if (has_1.default('dom-mutationobserver')) {
            /* tslint:disable-next-line:variable-name */
            var HostMutationObserver = global_1.default.MutationObserver || global_1.default.WebKitMutationObserver;
            var node_1 = document.createElement('div');
            var queue_2 = [];
            var observer = new HostMutationObserver(function () {
                while (queue_2.length > 0) {
                    var item = queue_2.shift();
                    if (item && item.isActive && item.callback) {
                        item.callback();
                    }
                }
            });
            observer.observe(node_1, { attributes: true });
            enqueue = function (item) {
                queue_2.push(item);
                node_1.setAttribute('queueStatus', '1');
            };
        }
        else {
            enqueue = function (item) {
                checkMicroTaskQueue();
                microTasks.push(item);
            };
        }
        return function (callback) {
            var item = {
                isActive: true,
                callback: callback
            };
            enqueue(item);
            return getQueueHandle(item);
        };
    })();
});
//# sourceMappingURL=queue.js.map