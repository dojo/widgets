import { handleDecorator } from './handleDecorator';
export function beforeProperties(method) {
    return handleDecorator((target, propertyKey) => {
        target.addDecorator('beforeProperties', propertyKey ? target[propertyKey] : method);
    });
}
export default beforeProperties;
//# sourceMappingURL=beforeProperties.mjs.map