import { WNode, DNode, WidgetBaseInterface, VNode } from '../widget-core/interfaces';
export interface CustomComparator {
    selector: string;
    property: string;
    comparator: (value: any) => boolean;
}
export interface FunctionalSelector {
    (node: VNode | WNode): undefined | Function;
}
export interface DecoratorResult<T> {
    hasDeferredProperties: boolean;
    nodes: T;
}
export interface ExpectedRender {
    (): DNode | DNode[];
}
export interface Expect {
    (expectedRenderFunc: ExpectedRender): void;
    (expectedRenderFunc: ExpectedRender, actualRenderFunc?: ExpectedRender): void;
}
export interface ExpectPartial {
    (selector: string, expectedRenderFunc: ExpectedRender): void;
    (selector: string, expectedRenderFunc: ExpectedRender, actualRenderFunc?: ExpectedRender): void;
}
export interface Trigger {
    (selector: string, functionSelector: FunctionalSelector, ...args: any[]): any;
    (selector: string, functionSelector: string, ...args: any[]): any;
}
export interface GetRender {
    (index?: number): DNode | DNode[];
}
export interface HarnessAPI {
    expect: Expect;
    expectPartial: ExpectPartial;
    trigger: Trigger;
    getRender: GetRender;
}
export declare function harness(renderFunc: () => WNode<WidgetBaseInterface>, customComparator?: CustomComparator[]): HarnessAPI;
export default harness;
