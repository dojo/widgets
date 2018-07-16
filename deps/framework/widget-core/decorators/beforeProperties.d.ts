import { BeforeProperties } from './../interfaces';
/**
 * Decorator that adds the function passed of target method to be run
 * in the `beforeProperties` lifecycle.
 */
export declare function beforeProperties(method: BeforeProperties): (target: any) => void;
export declare function beforeProperties(): (target: any, propertyKey: string) => void;
export default beforeProperties;
