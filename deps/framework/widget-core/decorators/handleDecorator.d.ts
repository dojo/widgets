export declare type DecoratorHandler = (target: any, propertyKey?: string) => void;
/**
 * Generic decorator handler to take care of whether or not the decorator was called at the class level
 * or the method level.
 *
 * @param handler
 */
export declare function handleDecorator(handler: DecoratorHandler): (target: any, propertyKey?: string | undefined, descriptor?: PropertyDescriptor | undefined) => void;
export default handleDecorator;
