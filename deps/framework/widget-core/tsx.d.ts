import { Constructor, DNode } from './interfaces';
import { WNode, VNodeProperties } from './interfaces';
declare global  {
    namespace JSX {
        type Element = WNode;
        interface ElementAttributesProperty {
            properties: {};
        }
        interface IntrinsicElements {
            [key: string]: VNodeProperties;
        }
    }
}
export declare const REGISTRY_ITEM: symbol;
export declare class FromRegistry<P> {
    static type: symbol;
    properties: P;
    name: string | undefined;
}
export declare function fromRegistry<P>(tag: string): Constructor<FromRegistry<P>>;
export declare function tsx(tag: any, properties?: {}, ...children: any[]): DNode;
