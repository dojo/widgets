import { handleDecorator } from './handleDecorator';
export function registry(nameOrConfig, loader) {
    return handleDecorator((target, propertyKey) => {
        target.addDecorator('afterConstructor', function () {
            if (typeof nameOrConfig === 'string') {
                this.registry.define(nameOrConfig, loader);
            }
            else {
                Object.keys(nameOrConfig).forEach((name) => {
                    this.registry.define(name, nameOrConfig[name]);
                });
            }
        });
    });
}
export default registry;
//# sourceMappingURL=registry.mjs.map