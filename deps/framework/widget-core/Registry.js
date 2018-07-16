(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/Promise", "../shim/Map", "../shim/Symbol", "../core/Evented"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Promise_1 = require("../shim/Promise");
    var Map_1 = require("../shim/Map");
    var Symbol_1 = require("../shim/Symbol");
    var Evented_1 = require("../core/Evented");
    /**
     * Widget base symbol type
     */
    exports.WIDGET_BASE_TYPE = Symbol_1.default('Widget Base');
    /**
     * Checks is the item is a subclass of WidgetBase (or a WidgetBase)
     *
     * @param item the item to check
     * @returns true/false indicating if the item is a WidgetBaseConstructor
     */
    function isWidgetBaseConstructor(item) {
        return Boolean(item && item._type === exports.WIDGET_BASE_TYPE);
    }
    exports.isWidgetBaseConstructor = isWidgetBaseConstructor;
    function isWidgetConstructorDefaultExport(item) {
        return Boolean(item &&
            item.hasOwnProperty('__esModule') &&
            item.hasOwnProperty('default') &&
            isWidgetBaseConstructor(item.default));
    }
    exports.isWidgetConstructorDefaultExport = isWidgetConstructorDefaultExport;
    /**
     * The Registry implementation
     */
    var Registry = /** @class */ (function (_super) {
        tslib_1.__extends(Registry, _super);
        function Registry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Emit loaded event for registry label
         */
        Registry.prototype.emitLoadedEvent = function (widgetLabel, item) {
            this.emit({
                type: widgetLabel,
                action: 'loaded',
                item: item
            });
        };
        Registry.prototype.define = function (label, item) {
            var _this = this;
            if (this._widgetRegistry === undefined) {
                this._widgetRegistry = new Map_1.default();
            }
            if (this._widgetRegistry.has(label)) {
                throw new Error("widget has already been registered for '" + label.toString() + "'");
            }
            this._widgetRegistry.set(label, item);
            if (item instanceof Promise_1.default) {
                item.then(function (widgetCtor) {
                    _this._widgetRegistry.set(label, widgetCtor);
                    _this.emitLoadedEvent(label, widgetCtor);
                    return widgetCtor;
                }, function (error) {
                    throw error;
                });
            }
            else if (isWidgetBaseConstructor(item)) {
                this.emitLoadedEvent(label, item);
            }
        };
        Registry.prototype.defineInjector = function (label, injectorFactory) {
            if (this._injectorRegistry === undefined) {
                this._injectorRegistry = new Map_1.default();
            }
            if (this._injectorRegistry.has(label)) {
                throw new Error("injector has already been registered for '" + label.toString() + "'");
            }
            var invalidator = new Evented_1.Evented();
            var injectorItem = {
                injector: injectorFactory(function () { return invalidator.emit({ type: 'invalidate' }); }),
                invalidator: invalidator
            };
            this._injectorRegistry.set(label, injectorItem);
            this.emitLoadedEvent(label, injectorItem);
        };
        Registry.prototype.get = function (label) {
            var _this = this;
            if (!this._widgetRegistry || !this.has(label)) {
                return null;
            }
            var item = this._widgetRegistry.get(label);
            if (isWidgetBaseConstructor(item)) {
                return item;
            }
            if (item instanceof Promise_1.default) {
                return null;
            }
            var promise = item();
            this._widgetRegistry.set(label, promise);
            promise.then(function (widgetCtor) {
                if (isWidgetConstructorDefaultExport(widgetCtor)) {
                    widgetCtor = widgetCtor.default;
                }
                _this._widgetRegistry.set(label, widgetCtor);
                _this.emitLoadedEvent(label, widgetCtor);
                return widgetCtor;
            }, function (error) {
                throw error;
            });
            return null;
        };
        Registry.prototype.getInjector = function (label) {
            if (!this._injectorRegistry || !this.hasInjector(label)) {
                return null;
            }
            return this._injectorRegistry.get(label);
        };
        Registry.prototype.has = function (label) {
            return Boolean(this._widgetRegistry && this._widgetRegistry.has(label));
        };
        Registry.prototype.hasInjector = function (label) {
            return Boolean(this._injectorRegistry && this._injectorRegistry.has(label));
        };
        return Registry;
    }(Evented_1.Evented));
    exports.Registry = Registry;
    exports.default = Registry;
});
//# sourceMappingURL=Registry.js.map