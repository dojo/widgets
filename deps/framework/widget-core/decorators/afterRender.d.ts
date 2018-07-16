/**
 * Decorator that can be used to register a function to run as an aspect to `render`
 */
export declare function afterRender(method: Function): (target: any) => void;
export declare function afterRender(): (target: any, propertyKey: string) => void;
export default afterRender;
