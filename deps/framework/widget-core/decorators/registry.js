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
    function registry(nameOrConfig, loader) {
        return handleDecorator_1.handleDecorator(function (target, propertyKey) {
            target.addDecorator('afterConstructor', function () {
                var _this = this;
                if (typeof nameOrConfig === 'string') {
                    this.registry.define(nameOrConfig, loader);
                }
                else {
                    Object.keys(nameOrConfig).forEach(function (name) {
                        _this.registry.define(name, nameOrConfig[name]);
                    });
                }
            });
        });
    }
    exports.registry = registry;
    exports.default = registry;
});
//# sourceMappingURL=registry.js.map