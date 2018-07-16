import WeakMap from '../../shim/WeakMap';
import { handleDecorator } from './handleDecorator';
import { beforeProperties } from './beforeProperties';
/**
 * Map of instances against registered injectors.
 */
const registeredInjectorsMap = new WeakMap();
/**
 * Decorator retrieves an injector from an available registry using the name and
 * calls the `getProperties` function with the payload from the injector
 * and current properties with the the injected properties returned.
 *
 * @param InjectConfig the inject configuration
 */
export function inject({ name, getProperties }) {
    return handleDecorator((target, propertyKey) => {
        beforeProperties(function (properties) {
            const injectorItem = this.registry.getInjector(name);
            if (injectorItem) {
                const { injector, invalidator } = injectorItem;
                const registeredInjectors = registeredInjectorsMap.get(this) || [];
                if (registeredInjectors.length === 0) {
                    registeredInjectorsMap.set(this, registeredInjectors);
                }
                if (registeredInjectors.indexOf(injectorItem) === -1) {
                    this.own(invalidator.on('invalidate', () => {
                        this.invalidate();
                    }));
                    registeredInjectors.push(injectorItem);
                }
                return getProperties(injector(), properties);
            }
        })(target);
    });
}
export default inject;
//# sourceMappingURL=inject.mjs.map