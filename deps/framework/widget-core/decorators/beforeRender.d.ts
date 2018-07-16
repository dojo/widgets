/**
 * Decorator that can be used to register a reducer function to run as an aspect before to `render`
 */
export declare function beforeRender(method: Function): (target: any) => void;
export declare function beforeRender(): (target: any, propertyKey: string) => void;
export default beforeRender;
