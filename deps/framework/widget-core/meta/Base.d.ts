import { Destroyable } from '../../core/Destroyable';
import { WidgetMetaBase, WidgetMetaProperties, NodeHandlerInterface, WidgetBaseInterface } from '../interfaces';
export declare class Base extends Destroyable implements WidgetMetaBase {
    private _invalidate;
    protected nodeHandler: NodeHandlerInterface;
    private _requestedNodeKeys;
    protected _bind: WidgetBaseInterface | undefined;
    constructor(properties: WidgetMetaProperties);
    has(key: string | number): boolean;
    protected getNode(key: string | number): Element | undefined;
    protected invalidate(): void;
    afterRender(): void;
}
export default Base;
