(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../shim/iterator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var iterator_1 = require("../../shim/iterator");
    function isPlugin(value) {
        return Boolean(value) && typeof value.load === 'function';
    }
    exports.isPlugin = isPlugin;
    function useDefault(modules) {
        if (iterator_1.isArrayLike(modules)) {
            var processedModules = [];
            for (var i = 0; i < modules.length; i++) {
                var module_1 = modules[i];
                processedModules.push(module_1.__esModule && module_1.default ? module_1.default : module_1);
            }
            return processedModules;
        }
        else if (iterator_1.isIterable(modules)) {
            var processedModules = [];
            try {
                for (var modules_1 = tslib_1.__values(modules), modules_1_1 = modules_1.next(); !modules_1_1.done; modules_1_1 = modules_1.next()) {
                    var module_2 = modules_1_1.value;
                    processedModules.push(module_2.__esModule && module_2.default ? module_2.default : module_2);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (modules_1_1 && !modules_1_1.done && (_a = modules_1.return)) _a.call(modules_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return processedModules;
        }
        else {
            return modules.__esModule && modules.default ? modules.default : modules;
        }
        var e_1, _a;
    }
    exports.useDefault = useDefault;
});
//# sourceMappingURL=util.js.map