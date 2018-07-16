import { handleDecorator } from './handleDecorator';
export function beforeRender(method) {
    return handleDecorator((target, propertyKey) => {
        target.addDecorator('beforeRender', propertyKey ? target[propertyKey] : method);
    });
}
export default beforeRender;
//# sourceMappingURL=beforeRender.mjs.map