import { WidgetBase } from '../widget-core/WidgetBase';
import { Constructor, DNode } from '../widget-core/interfaces';
import { LinkProperties } from './interfaces';
export declare class BaseLink extends WidgetBase<LinkProperties> {
    private _onClick(event);
    protected render(): DNode;
}
export declare function createLink(routerKey: string): Constructor<BaseLink>;
export declare const Link: Constructor<BaseLink>;
export default Link;
