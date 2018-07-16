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
    function beforeRender(method) {
        return handleDecorator_1.handleDecorator(function (target, propertyKey) {
            target.addDecorator('beforeRender', propertyKey ? target[propertyKey] : method);
        });
    }
    exports.beforeRender = beforeRender;
    exports.default = beforeRender;
});
//# sourceMappingURL=beforeRender.js.map