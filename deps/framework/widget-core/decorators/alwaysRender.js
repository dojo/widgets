(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./handleDecorator", "./beforeProperties"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var handleDecorator_1 = require("./handleDecorator");
    var beforeProperties_1 = require("./beforeProperties");
    function alwaysRender() {
        return handleDecorator_1.handleDecorator(function (target, propertyKey) {
            beforeProperties_1.beforeProperties(function () {
                this.invalidate();
            })(target);
        });
    }
    exports.alwaysRender = alwaysRender;
    exports.default = alwaysRender;
});
//# sourceMappingURL=alwaysRender.js.map