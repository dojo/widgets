(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/WeakMap", "../widget-core/WidgetBase", "../widget-core/d", "../widget-core/decorators/handleDecorator", "../widget-core/decorators/beforeProperties", "../widget-core/decorators/alwaysRender", "../../src/widget-core/Registry"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var WeakMap_1 = require("../shim/WeakMap");
    var WidgetBase_1 = require("../widget-core/WidgetBase");
    var d_1 = require("../widget-core/d");
    var handleDecorator_1 = require("../widget-core/decorators/handleDecorator");
    var beforeProperties_1 = require("../widget-core/decorators/beforeProperties");
    var alwaysRender_1 = require("../widget-core/decorators/alwaysRender");
    var Registry_1 = require("../../src/widget-core/Registry");
    var registeredInjectorsMap = new WeakMap_1.default();
    /**
     * Decorator that registers a store injector with a container based on paths when provided
     *
     * @param config Configuration of the store injector
     */
    function storeInject(config) {
        var name = config.name, paths = config.paths, getProperties = config.getProperties;
        return handleDecorator_1.handleDecorator(function (target, propertyKey) {
            beforeProperties_1.beforeProperties(function (properties) {
                var _this = this;
                var injectorItem = this.registry.getInjector(name);
                if (injectorItem) {
                    var injector = injectorItem.injector;
                    var store_1 = injector();
                    var registeredInjectors = registeredInjectorsMap.get(this) || [];
                    if (registeredInjectors.length === 0) {
                        registeredInjectorsMap.set(this, registeredInjectors);
                    }
                    if (registeredInjectors.indexOf(injectorItem) === -1) {
                        if (paths) {
                            var handle_1 = store_1.onChange(paths.map(function (path) { return store_1.path(path.join('/')); }), function () {
                                return _this.invalidate();
                            });
                            this.own({
                                destroy: function () {
                                    handle_1.remove();
                                }
                            });
                        }
                        else {
                            this.own(store_1.on('invalidate', function () {
                                _this.invalidate();
                            }));
                        }
                        registeredInjectors.push(injectorItem);
                    }
                    return getProperties(store_1, properties);
                }
            })(target);
        });
    }
    exports.storeInject = storeInject;
    function StoreContainer(component, name, _a) {
        var paths = _a.paths, getProperties = _a.getProperties;
        var WidgetContainer = /** @class */ (function (_super) {
            tslib_1.__extends(WidgetContainer, _super);
            function WidgetContainer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            WidgetContainer.prototype.render = function () {
                return d_1.w(component, this.properties, this.children);
            };
            WidgetContainer = tslib_1.__decorate([
                alwaysRender_1.alwaysRender(),
                storeInject({ name: name, paths: paths, getProperties: getProperties })
            ], WidgetContainer);
            return WidgetContainer;
        }(WidgetBase_1.WidgetBase));
        return WidgetContainer;
    }
    exports.StoreContainer = StoreContainer;
    /**
     * Creates a typed `StoreContainer` for State generic.
     */
    function createStoreContainer() {
        return function (component, name, _a) {
            var paths = _a.paths, getProperties = _a.getProperties;
            return StoreContainer(component, name, { paths: paths, getProperties: getProperties });
        };
    }
    exports.createStoreContainer = createStoreContainer;
    function registerStoreInjector(store, options) {
        if (options === void 0) { options = {}; }
        var _a = options.key, key = _a === void 0 ? 'state' : _a, _b = options.registry, registry = _b === void 0 ? new Registry_1.Registry() : _b;
        if (registry.hasInjector(key)) {
            throw new Error("Store has already been defined for key " + key.toString());
        }
        registry.defineInjector(key, function () {
            return function () { return store; };
        });
        return registry;
    }
    exports.registerStoreInjector = registerStoreInjector;
});
//# sourceMappingURL=StoreInjector.js.map