import * as tslib_1 from "tslib";
import { WidgetBase } from '../widget-core/WidgetBase';
import { w } from '../widget-core/d';
import { inject } from '../widget-core/decorators/inject';
import { alwaysRender } from '../widget-core/decorators/alwaysRender';
export function isComponent(value) {
    return Boolean(value && (typeof value === 'string' || typeof value === 'function' || typeof value === 'symbol'));
}
export function getProperties(router, properties) {
    return { router };
}
export function Outlet(outletComponents, outlet, options = {}) {
    const indexComponent = isComponent(outletComponents) ? undefined : outletComponents.index;
    const mainComponent = isComponent(outletComponents) ? outletComponents : outletComponents.main;
    const errorComponent = isComponent(outletComponents) ? undefined : outletComponents.error;
    const { mapParams, key = 'router' } = options;
    let OutletComponent = class OutletComponent extends WidgetBase {
        constructor() {
            super(...arguments);
            this._matched = false;
            this._matchedParams = {};
        }
        _hasRouteChanged(params) {
            if (!this._matched) {
                return true;
            }
            const newParamKeys = Object.keys(params);
            for (let i = 0; i < newParamKeys.length; i++) {
                const key = newParamKeys[i];
                if (this._matchedParams[key] !== params[key]) {
                    return true;
                }
            }
            return false;
        }
        _onEnter(outletContext, onEnterCallback) {
            const { params, type } = outletContext;
            if (this._hasRouteChanged(params)) {
                onEnterCallback && onEnterCallback(params, type);
                this._matched = true;
                this._matchedParams = params;
            }
        }
        onDetach() {
            if (this._matched) {
                this._onExit && this._onExit();
                this._matched = false;
            }
        }
        render() {
            let _a = this.properties, { router } = _a, properties = tslib_1.__rest(_a, ["router"]);
            const outletContext = router.getOutlet(outlet);
            if (outletContext) {
                const { queryParams, params, type, onEnter, onExit } = outletContext;
                this._onExit = onExit;
                if (mapParams) {
                    properties = Object.assign({}, properties, mapParams({ queryParams, params, type, router }));
                }
                if (type === 'index' && indexComponent) {
                    this._onEnter(outletContext, onEnter);
                    return w(indexComponent, properties, this.children);
                }
                else if (type === 'error' && errorComponent) {
                    this._onEnter(outletContext, onEnter);
                    return w(errorComponent, properties, this.children);
                }
                else if (type === 'error' && indexComponent) {
                    this._onEnter(outletContext, onEnter);
                    return w(indexComponent, properties, this.children);
                }
                else if (type !== 'error' && mainComponent) {
                    this._onEnter(outletContext, onEnter);
                    return w(mainComponent, properties, this.children);
                }
            }
            if (this._matched) {
                this._onExit && this._onExit();
                this._matched = false;
            }
            return null;
        }
    };
    OutletComponent = tslib_1.__decorate([
        inject({ name: key, getProperties }),
        alwaysRender()
    ], OutletComponent);
    return OutletComponent;
}
//# sourceMappingURL=Outlet.mjs.map