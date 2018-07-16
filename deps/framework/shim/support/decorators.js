(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./has"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var has_1 = require("./has");
    /**
     * A class decorator that provides either a native class or a shimmed class based on a feature
     * test
     * @param feature The has feature to check
     * @param trueClass The class to use if feature test returns `true`
     * @param falseClass The class to use if the feature test returns `false` or is not defined
     */
    function hasClass(feature, trueClass, falseClass) {
        return function (target) {
            /* Return type generics aren't catching the fact that Function is assignable to the generic */
            return (has_1.default(feature) ? trueClass : falseClass);
        };
    }
    exports.hasClass = hasClass;
});
//# sourceMappingURL=decorators.js.map