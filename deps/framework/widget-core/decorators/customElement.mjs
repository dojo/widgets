import { CustomElementChildType } from '../registerCustomElement';
import Registry from '../Registry';
/**
 * This Decorator is provided properties that define the behavior of a custom element, and
 * registers that custom element.
 */
export function customElement({ tag, properties = [], attributes = [], events = [], childType = CustomElementChildType.DOJO, registryFactory = () => new Registry() }) {
    return function (target) {
        target.prototype.__customElementDescriptor = {
            tagName: tag,
            attributes,
            properties,
            events,
            childType,
            registryFactory
        };
    };
}
export default customElement;
//# sourceMappingURL=customElement.mjs.map