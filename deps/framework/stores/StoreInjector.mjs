import * as tslib_1 from "tslib";
import WeakMap from '../shim/WeakMap';
import { WidgetBase } from '../widget-core/WidgetBase';
import { w } from '../widget-core/d';
import { handleDecorator } from '../widget-core/decorators/handleDecorator';
import { beforeProperties } from '../widget-core/decorators/beforeProperties';
import { alwaysRender } from '../widget-core/decorators/alwaysRender';
import { Registry } from '../../src/widget-core/Registry';
const registeredInjectorsMap = new WeakMap();
/**
 * Decorator that registers a store injector with a container based on paths when provided
 *
 * @param config Configuration of the store injector
 */
export function storeInject(config) {
    const { name, paths, getProperties } = config;
    return handleDecorator((target, propertyKey) => {
        beforeProperties(function (properties) {
            const injectorItem = this.registry.getInjector(name);
            if (injectorItem) {
                const { injector } = injectorItem;
                const store = injector();
                const registeredInjectors = registeredInjectorsMap.get(this) || [];
                if (registeredInjectors.length === 0) {
                    registeredInjectorsMap.set(this, registeredInjectors);
                }
                if (registeredInjectors.indexOf(injectorItem) === -1) {
                    if (paths) {
                        const handle = store.onChange(paths.map((path) => store.path(path.join('/'))), () => this.invalidate());
                        this.own({
                            destroy: () => {
                                handle.remove();
                            }
                        });
                    }
                    else {
                        this.own(store.on('invalidate', () => {
                            this.invalidate();
                        }));
                    }
                    registeredInjectors.push(injectorItem);
                }
                return getProperties(store, properties);
            }
        })(target);
    });
}
export function StoreContainer(component, name, { paths, getProperties }) {
    let WidgetContainer = class WidgetContainer extends WidgetBase {
        render() {
            return w(component, this.properties, this.children);
        }
    };
    WidgetContainer = tslib_1.__decorate([
        alwaysRender(),
        storeInject({ name, paths, getProperties })
    ], WidgetContainer);
    return WidgetContainer;
}
/**
 * Creates a typed `StoreContainer` for State generic.
 */
export function createStoreContainer() {
    return (component, name, { paths, getProperties }) => {
        return StoreContainer(component, name, { paths, getProperties });
    };
}
export function registerStoreInjector(store, options = {}) {
    const { key = 'state', registry = new Registry() } = options;
    if (registry.hasInjector(key)) {
        throw new Error(`Store has already been defined for key ${key.toString()}`);
    }
    registry.defineInjector(key, () => {
        return () => store;
    });
    return registry;
}
//# sourceMappingURL=StoreInjector.mjs.map