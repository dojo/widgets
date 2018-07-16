export declare enum CustomElementChildType {
    DOJO = "DOJO",
    NODE = "NODE",
    TEXT = "TEXT",
}
export declare function DomToWidgetWrapper(domNode: HTMLElement): any;
export declare function create(descriptor: any, WidgetConstructor: any): any;
export declare function register(WidgetConstructor: any): void;
export default register;
