(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../widget-core/WidgetBase", "../widget-core/d", "../widget-core/decorators/inject", "../widget-core/decorators/alwaysRender"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var WidgetBase_1 = require("../widget-core/WidgetBase");
    var d_1 = require("../widget-core/d");
    var inject_1 = require("../widget-core/decorators/inject");
    var alwaysRender_1 = require("../widget-core/decorators/alwaysRender");
    function isComponent(value) {
        return Boolean(value && (typeof value === 'string' || typeof value === 'function' || typeof value === 'symbol'));
    }
    exports.isComponent = isComponent;
    function getProperties(router, properties) {
        return { router: router };
    }
    exports.getProperties = getProperties;
    function Outlet(outletComponents, outlet, options) {
        if (options === void 0) { options = {}; }
        var indexComponent = isComponent(outletComponents) ? undefined : outletComponents.index;
        var mainComponent = isComponent(outletComponents) ? outletComponents : outletComponents.main;
        var errorComponent = isComponent(outletComponents) ? undefined : outletComponents.error;
        var mapParams = options.mapParams, _a = options.key, key = _a === void 0 ? 'router' : _a;
        var OutletComponent = /** @class */ (function (_super) {
            tslib_1.__extends(OutletComponent, _super);
            function OutletComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._matched = false;
                _this._matchedParams = {};
                return _this;
            }
            OutletComponent.prototype._hasRouteChanged = function (params) {
                if (!this._matched) {
                    return true;
                }
                var newParamKeys = Object.keys(params);
                for (var i = 0; i < newParamKeys.length; i++) {
                    var key_1 = newParamKeys[i];
                    if (this._matchedParams[key_1] !== params[key_1]) {
                        return true;
                    }
                }
                return false;
            };
            OutletComponent.prototype._onEnter = function (outletContext, onEnterCallback) {
                var params = outletContext.params, type = outletContext.type;
                if (this._hasRouteChanged(params)) {
                    onEnterCallback && onEnterCallback(params, type);
                    this._matched = true;
                    this._matchedParams = params;
                }
            };
            OutletComponent.prototype.onDetach = function () {
                if (this._matched) {
                    this._onExit && this._onExit();
                    this._matched = false;
                }
            };
            OutletComponent.prototype.render = function () {
                var _a = this.properties, router = _a.router, properties = tslib_1.__rest(_a, ["router"]);
                var outletContext = router.getOutlet(outlet);
                if (outletContext) {
                    var queryParams = outletContext.queryParams, params = outletContext.params, type = outletContext.type, onEnter = outletContext.onEnter, onExit = outletContext.onExit;
                    this._onExit = onExit;
                    if (mapParams) {
                        properties = tslib_1.__assign({}, properties, mapParams({ queryParams: queryParams, params: params, type: type, router: router }));
                    }
                    if (type === 'index' && indexComponent) {
                        this._onEnter(outletContext, onEnter);
                        return d_1.w(indexComponent, properties, this.children);
                    }
                    else if (type === 'error' && errorComponent) {
                        this._onEnter(outletContext, onEnter);
                        return d_1.w(errorComponent, properties, this.children);
                    }
                    else if (type === 'error' && indexComponent) {
                        this._onEnter(outletContext, onEnter);
                        return d_1.w(indexComponent, properties, this.children);
                    }
                    else if (type !== 'error' && mainComponent) {
                        this._onEnter(outletContext, onEnter);
                        return d_1.w(mainComponent, properties, this.children);
                    }
                }
                if (this._matched) {
                    this._onExit && this._onExit();
                    this._matched = false;
                }
                return null;
            };
            OutletComponent = tslib_1.__decorate([
                inject_1.inject({ name: key, getProperties: getProperties }),
                alwaysRender_1.alwaysRender()
            ], OutletComponent);
            return OutletComponent;
        }(WidgetBase_1.WidgetBase));
        return OutletComponent;
    }
    exports.Outlet = Outlet;
});
//# sourceMappingURL=Outlet.js.map