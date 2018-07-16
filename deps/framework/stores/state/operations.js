(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Patch", "./Pointer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Patch_1 = require("./Patch");
    var Pointer_1 = require("./Pointer");
    function add(path, value) {
        return {
            op: Patch_1.OperationType.ADD,
            path: new Pointer_1.Pointer(path.path),
            value: value
        };
    }
    exports.add = add;
    function replace(path, value) {
        return {
            op: Patch_1.OperationType.REPLACE,
            path: new Pointer_1.Pointer(path.path),
            value: value
        };
    }
    exports.replace = replace;
    function remove(path) {
        return {
            op: Patch_1.OperationType.REMOVE,
            path: new Pointer_1.Pointer(path.path)
        };
    }
    exports.remove = remove;
    function test(path, value) {
        return {
            op: Patch_1.OperationType.TEST,
            path: new Pointer_1.Pointer(path.path),
            value: value
        };
    }
    exports.test = test;
});
//# sourceMappingURL=operations.js.map