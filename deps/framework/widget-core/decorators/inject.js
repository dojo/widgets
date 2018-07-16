(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../shim/WeakMap", "./handleDecorator", "./beforeProperties"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WeakMap_1 = require("../../shim/WeakMap");
    var handleDecorator_1 = require("./handleDecorator");
    var beforeProperties_1 = require("./beforeProperties");
    /**
     * Map of instances against registered injectors.
     */
    var registeredInjectorsMap = new WeakMap_1.default();
    /**
     * Decorator retrieves an injector from an available registry using the name and
     * calls the `getProperties` function with the payload from the injector
     * and current properties with the the injected properties returned.
     *
     * @param InjectConfig the inject configuration
     */
    function inject(_a) {
        var name = _a.name, getProperties = _a.getProperties;
        return handleDecorator_1.handleDecorator(function (target, propertyKey) {
            beforeProperties_1.beforeProperties(function (properties) {
                var _this = this;
                var injectorItem = this.registry.getInjector(name);
                if (injectorItem) {
                    var injector = injectorItem.injector, invalidator = injectorItem.invalidator;
                    var registeredInjectors = registeredInjectorsMap.get(this) || [];
                    if (registeredInjectors.length === 0) {
                        registeredInjectorsMap.set(this, registeredInjectors);
                    }
                    if (registeredInjectors.indexOf(injectorItem) === -1) {
                        this.own(invalidator.on('invalidate', function () {
                            _this.invalidate();
                        }));
                        registeredInjectors.push(injectorItem);
                    }
                    return getProperties(injector(), properties);
                }
            })(target);
        });
    }
    exports.inject = inject;
    exports.default = inject;
});
//# sourceMappingURL=inject.js.map