(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Generic decorator handler to take care of whether or not the decorator was called at the class level
     * or the method level.
     *
     * @param handler
     */
    function handleDecorator(handler) {
        return function (target, propertyKey, descriptor) {
            if (typeof target === 'function') {
                handler(target.prototype, undefined);
            }
            else {
                handler(target, propertyKey);
            }
        };
    }
    exports.handleDecorator = handleDecorator;
    exports.default = handleDecorator;
});
//# sourceMappingURL=handleDecorator.js.map