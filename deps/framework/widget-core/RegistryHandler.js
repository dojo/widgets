(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/Map", "../core/Evented", "./Registry"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Map_1 = require("../shim/Map");
    var Evented_1 = require("../core/Evented");
    var Registry_1 = require("./Registry");
    var RegistryHandler = /** @class */ (function (_super) {
        tslib_1.__extends(RegistryHandler, _super);
        function RegistryHandler() {
            var _this = _super.call(this) || this;
            _this._registry = new Registry_1.Registry();
            _this._registryWidgetLabelMap = new Map_1.Map();
            _this._registryInjectorLabelMap = new Map_1.Map();
            _this.own(_this._registry);
            var destroy = function () {
                if (_this.baseRegistry) {
                    _this._registryWidgetLabelMap.delete(_this.baseRegistry);
                    _this._registryInjectorLabelMap.delete(_this.baseRegistry);
                    _this.baseRegistry = undefined;
                }
            };
            _this.own({ destroy: destroy });
            return _this;
        }
        Object.defineProperty(RegistryHandler.prototype, "base", {
            set: function (baseRegistry) {
                if (this.baseRegistry) {
                    this._registryWidgetLabelMap.delete(this.baseRegistry);
                    this._registryInjectorLabelMap.delete(this.baseRegistry);
                }
                this.baseRegistry = baseRegistry;
            },
            enumerable: true,
            configurable: true
        });
        RegistryHandler.prototype.define = function (label, widget) {
            this._registry.define(label, widget);
        };
        RegistryHandler.prototype.defineInjector = function (label, injector) {
            this._registry.defineInjector(label, injector);
        };
        RegistryHandler.prototype.has = function (label) {
            return this._registry.has(label) || Boolean(this.baseRegistry && this.baseRegistry.has(label));
        };
        RegistryHandler.prototype.hasInjector = function (label) {
            return this._registry.hasInjector(label) || Boolean(this.baseRegistry && this.baseRegistry.hasInjector(label));
        };
        RegistryHandler.prototype.get = function (label, globalPrecedence) {
            if (globalPrecedence === void 0) { globalPrecedence = false; }
            return this._get(label, globalPrecedence, 'get', this._registryWidgetLabelMap);
        };
        RegistryHandler.prototype.getInjector = function (label, globalPrecedence) {
            if (globalPrecedence === void 0) { globalPrecedence = false; }
            return this._get(label, globalPrecedence, 'getInjector', this._registryInjectorLabelMap);
        };
        RegistryHandler.prototype._get = function (label, globalPrecedence, getFunctionName, labelMap) {
            var _this = this;
            var registries = globalPrecedence ? [this.baseRegistry, this._registry] : [this._registry, this.baseRegistry];
            for (var i = 0; i < registries.length; i++) {
                var registry = registries[i];
                if (!registry) {
                    continue;
                }
                var item = registry[getFunctionName](label);
                var registeredLabels = labelMap.get(registry) || [];
                if (item) {
                    return item;
                }
                else if (registeredLabels.indexOf(label) === -1) {
                    var handle = registry.on(label, function (event) {
                        if (event.action === 'loaded' &&
                            _this[getFunctionName](label, globalPrecedence) === event.item) {
                            _this.emit({ type: 'invalidate' });
                        }
                    });
                    this.own(handle);
                    labelMap.set(registry, tslib_1.__spread(registeredLabels, [label]));
                }
            }
            return null;
        };
        return RegistryHandler;
    }(Evented_1.Evented));
    exports.RegistryHandler = RegistryHandler;
    exports.default = RegistryHandler;
});
//# sourceMappingURL=RegistryHandler.js.map