import * as tslib_1 from "tslib";
import { WidgetBase } from './WidgetBase';
import { inject } from './decorators/inject';
import { w } from './d';
import { alwaysRender } from './decorators/alwaysRender';
export function Container(component, name, { getProperties }) {
    let WidgetContainer = class WidgetContainer extends WidgetBase {
        render() {
            return w(component, this.properties, this.children);
        }
    };
    WidgetContainer = tslib_1.__decorate([
        alwaysRender(),
        inject({ name, getProperties })
    ], WidgetContainer);
    return WidgetContainer;
}
export default Container;
//# sourceMappingURL=Container.mjs.map