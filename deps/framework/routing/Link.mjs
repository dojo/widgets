import * as tslib_1 from "tslib";
import { WidgetBase } from '../widget-core/WidgetBase';
import { v } from '../widget-core/d';
import { inject } from '../widget-core/decorators/inject';
const getProperties = (router, properties) => {
    const { to, isOutlet = true, params = {}, onClick } = properties, props = tslib_1.__rest(properties, ["to", "isOutlet", "params", "onClick"]);
    const href = isOutlet ? router.link(to, params) : to;
    const handleOnClick = (event) => {
        onClick && onClick(event);
        if (!event.defaultPrevented && event.button === 0 && !properties.target) {
            event.preventDefault();
            href !== undefined && router.setPath(href);
        }
    };
    return Object.assign({ href, onClick: handleOnClick }, props);
};
export class BaseLink extends WidgetBase {
    _onClick(event) {
        this.properties.onClick && this.properties.onClick(event);
    }
    render() {
        const props = Object.assign({}, this.properties, { onclick: this._onClick, onClick: undefined, to: undefined, isOutlet: undefined, params: undefined, routerKey: undefined, router: undefined });
        return v('a', props, this.children);
    }
}
export function createLink(routerKey) {
    let Link = class Link extends BaseLink {
    };
    Link = tslib_1.__decorate([
        inject({ name: routerKey, getProperties })
    ], Link);
    return Link;
}
export const Link = createLink('router');
export default Link;
//# sourceMappingURL=Link.mjs.map