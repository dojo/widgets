import { DNode, DefaultWidgetBaseInterface, WNode, VNode } from '../../widget-core/interfaces';
export declare type TestFunction = (elem: DNode<DefaultWidgetBaseInterface>) => boolean;
export declare const parseSelector: (selector: string) => string;
export declare const adapter: any;
export declare function select(selector: string, nodes: DNode | DNode[]): (WNode | VNode)[];
export default select;
