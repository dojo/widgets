import { DiffPropertyFunction } from './../interfaces';
/**
 * Decorator that can be used to register a function as a specific property diff
 *
 * @param propertyName  The name of the property of which the diff function is applied
 * @param diffType      The diff type, default is DiffType.AUTO.
 * @param diffFunction  A diff function to run if diffType if DiffType.CUSTOM
 */
export declare function diffProperty(propertyName: string, diffFunction?: DiffPropertyFunction, reactionFunction?: Function): (target: any, propertyKey?: string | undefined, descriptor?: PropertyDescriptor | undefined) => void;
export default diffProperty;
