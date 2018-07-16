import { Evented } from '../core/Evented';
import { EventObject } from '../core/interfaces';
import { NodeHandlerInterface } from './interfaces';
/**
 * Enum to identify the type of event.
 * Listening to 'Projector' will notify when projector is created or updated
 * Listening to 'Widget' will notify when widget root is created or updated
 */
export declare enum NodeEventType {
    Projector = "Projector",
    Widget = "Widget",
}
export declare type NodeHandlerEventMap = {
    Projector: EventObject<NodeEventType.Projector>;
    Widget: EventObject<NodeEventType.Widget>;
};
export declare class NodeHandler extends Evented<NodeHandlerEventMap> implements NodeHandlerInterface {
    private _nodeMap;
    get(key: string): Element | undefined;
    has(key: string): boolean;
    add(element: Element, key: string): void;
    addRoot(): void;
    addProjector(): void;
    clear(): void;
}
export default NodeHandler;
