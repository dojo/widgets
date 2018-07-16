import { v, w } from './d';
export const REGISTRY_ITEM = Symbol('Identifier for an item from the Widget Registry.');
export class FromRegistry {
    constructor() {
        this.properties = {};
    }
}
FromRegistry.type = REGISTRY_ITEM;
export function fromRegistry(tag) {
    return _a = class extends FromRegistry {
            constructor() {
                super(...arguments);
                this.properties = {};
                this.name = tag;
            }
        },
        _a.type = REGISTRY_ITEM,
        _a;
    var _a;
}
function spreadChildren(children, child) {
    if (Array.isArray(child)) {
        return child.reduce(spreadChildren, children);
    }
    else {
        return [...children, child];
    }
}
export function tsx(tag, properties = {}, ...children) {
    children = children.reduce(spreadChildren, []);
    properties = properties === null ? {} : properties;
    if (typeof tag === 'string') {
        return v(tag, properties, children);
    }
    else if (tag.type === REGISTRY_ITEM) {
        const registryItem = new tag();
        return w(registryItem.name, properties, children);
    }
    else {
        return w(tag, properties, children);
    }
}
//# sourceMappingURL=tsx.mjs.map