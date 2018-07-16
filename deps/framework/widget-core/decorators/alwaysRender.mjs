import { handleDecorator } from './handleDecorator';
import { beforeProperties } from './beforeProperties';
export function alwaysRender() {
    return handleDecorator((target, propertyKey) => {
        beforeProperties(function () {
            this.invalidate();
        })(target);
    });
}
export default alwaysRender;
//# sourceMappingURL=alwaysRender.mjs.map