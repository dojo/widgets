(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./handleDecorator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var handleDecorator_1 = require("./handleDecorator");
    function beforeProperties(method) {
        return handleDecorator_1.handleDecorator(function (target, propertyKey) {
            target.addDecorator('beforeProperties', propertyKey ? target[propertyKey] : method);
        });
    }
    exports.beforeProperties = beforeProperties;
    exports.default = beforeProperties;
});
//# sourceMappingURL=beforeProperties.js.map