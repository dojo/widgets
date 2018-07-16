import { Constructor, DefaultWidgetBaseInterface, DeferredVirtualProperties, DNode, VNode, RegistryLabel, VNodeProperties, WidgetBaseInterface, WNode, DomOptions } from './interfaces';
import { RenderResult } from './vdom';
/**
 * The symbol identifier for a WNode type
 */
export declare const WNODE: symbol;
/**
 * The symbol identifier for a VNode type
 */
export declare const VNODE: symbol;
/**
 * The symbol identifier for a VNode type created using dom()
 */
export declare const DOMVNODE: symbol;
/**
 * Helper function that returns true if the `DNode` is a `WNode` using the `type` property
 */
export declare function isWNode<W extends WidgetBaseInterface = DefaultWidgetBaseInterface>(child: DNode<W>): child is WNode<W>;
/**
 * Helper function that returns true if the `DNode` is a `VNode` using the `type` property
 */
export declare function isVNode(child: DNode): child is VNode;
/**
 * Helper function that returns true if the `DNode` is a `VNode` created with `dom()` using the `type` property
 */
export declare function isDomVNode(child: DNode): child is VNode;
export declare function isElementNode(value: any): value is Element;
/**
 * Interface for the decorate modifier
 */
export interface Modifier<T extends DNode> {
    (dNode: T, breaker: () => void): void;
}
/**
 * The predicate function for decorate
 */
export interface Predicate<T extends DNode> {
    (dNode: DNode): dNode is T;
}
/**
 * Decorator options
 */
export interface DecorateOptions<T extends DNode> {
    modifier: Modifier<T>;
    predicate?: Predicate<T>;
    shallow?: boolean;
}
/**
 * Generic decorate function for DNodes. The nodes are modified in place based on the provided predicate
 * and modifier functions.
 *
 * The children of each node are flattened and added to the array for decoration.
 *
 * If no predicate is supplied then the modifier will be executed on all nodes. A `breaker` function is passed to the
 * modifier which will drain the nodes array and exit the decoration.
 *
 * When the `shallow` options is set to `true` the only the top node or nodes will be decorated (only supported using
 * `DecorateOptions`).
 */
export declare function decorate<T extends DNode>(dNodes: DNode, options: DecorateOptions<T>): DNode;
export declare function decorate<T extends DNode>(dNodes: DNode[], options: DecorateOptions<T>): DNode[];
export declare function decorate<T extends DNode>(dNodes: DNode | DNode[], options: DecorateOptions<T>): DNode | DNode[];
export declare function decorate<T extends DNode>(dNodes: DNode, modifier: Modifier<T>, predicate: Predicate<T>): DNode;
export declare function decorate<T extends DNode>(dNodes: DNode[], modifier: Modifier<T>, predicate: Predicate<T>): DNode[];
export declare function decorate<T extends DNode>(dNodes: RenderResult, modifier: Modifier<T>, predicate: Predicate<T>): RenderResult;
export declare function decorate(dNodes: DNode, modifier: Modifier<DNode>): DNode;
export declare function decorate(dNodes: DNode[], modifier: Modifier<DNode>): DNode[];
export declare function decorate(dNodes: RenderResult, modifier: Modifier<DNode>): RenderResult;
/**
 * Wrapper function for calls to create a widget.
 */
export declare function w<W extends WidgetBaseInterface>(widgetConstructor: Constructor<W> | RegistryLabel, properties: W['properties'], children?: W['children']): WNode<W>;
/**
 * Wrapper function for calls to create VNodes.
 */
export declare function v(tag: string, children: undefined | DNode[]): VNode;
export declare function v(tag: string, properties: DeferredVirtualProperties | VNodeProperties, children?: DNode[]): VNode;
export declare function v(tag: string): VNode;
/**
 * Create a VNode for an existing DOM Node.
 */
export declare function dom({node, attrs, props, on, diffType}: DomOptions, children?: DNode[]): VNode;
