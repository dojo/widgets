import { handleDecorator } from './handleDecorator';
export function afterRender(method) {
    return handleDecorator((target, propertyKey) => {
        target.addDecorator('afterRender', propertyKey ? target[propertyKey] : method);
    });
}
export default afterRender;
//# sourceMappingURL=afterRender.mjs.map