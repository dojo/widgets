(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../shim/Promise", "./load/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise_1 = require("../shim/Promise");
    var util_1 = require("./load/util");
    exports.isPlugin = util_1.isPlugin;
    exports.useDefault = util_1.useDefault;
    function isAmdRequire(object) {
        return typeof object.toUrl === 'function';
    }
    exports.isAmdRequire = isAmdRequire;
    function isNodeRequire(object) {
        return typeof object.resolve === 'function';
    }
    exports.isNodeRequire = isNodeRequire;
    var load = (function () {
        var resolver = isAmdRequire(require)
            ? require.toUrl
            : isNodeRequire(require) ? require.resolve : function (resourceId) { return resourceId; };
        function pluginLoad(moduleIds, load, loader) {
            var pluginResourceIds = [];
            moduleIds = moduleIds.map(function (id, i) {
                var parts = id.split('!');
                pluginResourceIds[i] = parts[1];
                return parts[0];
            });
            return loader(moduleIds).then(function (modules) {
                pluginResourceIds.forEach(function (resourceId, i) {
                    if (typeof resourceId === 'string') {
                        var module_1 = modules[i];
                        var defaultExport = module_1['default'] || module_1;
                        if (util_1.isPlugin(defaultExport)) {
                            resourceId =
                                typeof defaultExport.normalize === 'function'
                                    ? defaultExport.normalize(resourceId, resolver)
                                    : resolver(resourceId);
                            modules[i] = defaultExport.load(resourceId, load);
                        }
                    }
                });
                return Promise_1.default.all(modules);
            });
        }
        if (typeof module === 'object' && typeof module.exports === 'object') {
            return function load(contextualRequire) {
                var moduleIds = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    moduleIds[_i - 1] = arguments[_i];
                }
                if (typeof contextualRequire === 'string') {
                    moduleIds.unshift(contextualRequire);
                    contextualRequire = require;
                }
                return pluginLoad(moduleIds, load, function (moduleIds) {
                    try {
                        return Promise_1.default.resolve(moduleIds.map(function (moduleId) {
                            return contextualRequire(moduleId.split('!')[0]);
                        }));
                    }
                    catch (error) {
                        return Promise_1.default.reject(error);
                    }
                });
            };
        }
        else if (typeof define === 'function' && define.amd) {
            return function load(contextualRequire) {
                var moduleIds = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    moduleIds[_i - 1] = arguments[_i];
                }
                if (typeof contextualRequire === 'string') {
                    moduleIds.unshift(contextualRequire);
                    contextualRequire = require;
                }
                return pluginLoad(moduleIds, load, function (moduleIds) {
                    return new Promise_1.default(function (resolve, reject) {
                        var errorHandle;
                        if (typeof contextualRequire.on === 'function') {
                            errorHandle = contextualRequire.on('error', function (error) {
                                errorHandle.remove();
                                reject(error);
                            });
                        }
                        contextualRequire(moduleIds, function () {
                            var modules = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                modules[_i] = arguments[_i];
                            }
                            errorHandle && errorHandle.remove();
                            resolve(modules);
                        });
                    });
                });
            };
        }
        else {
            return function () {
                return Promise_1.default.reject(new Error('Unknown loader'));
            };
        }
    })();
    exports.default = load;
});
//# sourceMappingURL=load.js.map