import { DNode } from '../../widget-core/interfaces';
export declare function formatDNodes(nodes: DNode | DNode[], depth?: number): string;
export declare function assertRender(actual: DNode | DNode[], expected: DNode | DNode[], message?: string): void;
export default assertRender;
