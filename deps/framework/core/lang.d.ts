import { Handle } from './interfaces';
export { assign } from '../shim/object';
/**
 * Creates a new object from the given prototype, and copies all enumerable own properties of one or more
 * source objects to the newly created target object.
 *
 * @param prototype The prototype to create a new object from
 * @param mixins Any number of objects whose enumerable own properties will be copied to the created object
 * @return The new object
 */
export declare function create<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}, Y extends {}, Z extends {}>(prototype: T, mixin1: U, mixin2: V, mixin3: W, mixin4: X, mixin5: Y, mixin6: Z): T & U & V & W & X & Y & Z;
export declare function create<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}, Y extends {}>(prototype: T, mixin1: U, mixin2: V, mixin3: W, mixin4: X, mixin5: Y): T & U & V & W & X & Y;
export declare function create<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}>(prototype: T, mixin1: U, mixin2: V, mixin3: W, mixin4: X): T & U & V & W & X;
export declare function create<T extends {}, U extends {}, V extends {}, W extends {}>(prototype: T, mixin1: U, mixin2: V, mixin3: W): T & U & V & W;
export declare function create<T extends {}, U extends {}, V extends {}>(prototype: T, mixin1: U, mixin2: V): T & U & V;
export declare function create<T extends {}, U extends {}>(prototype: T, mixin: U): T & U;
export declare function create<T extends {}>(prototype: T): T;
/**
 * Copies the values of all enumerable own properties of one or more source objects to the target object,
 * recursively copying all nested objects and arrays as well.
 *
 * @param target The target object to receive values from source objects
 * @param sources Any number of objects whose enumerable own properties will be copied to the target object
 * @return The modified target object
 */
export declare function deepAssign<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}, Y extends {}, Z extends {}>(target: T, source1: U, source2: V, source3: W, source4: X, source5: Y, source6: Z): T & U & V & W & X & Y & Z;
export declare function deepAssign<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}, Y extends {}>(target: T, source1: U, source2: V, source3: W, source4: X, source5: Y): T & U & V & W & X & Y;
export declare function deepAssign<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}>(target: T, source1: U, source2: V, source3: W, source4: X): T & U & V & W & X;
export declare function deepAssign<T extends {}, U extends {}, V extends {}, W extends {}>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export declare function deepAssign<T extends {}, U extends {}, V extends {}>(target: T, source1: U, source2: V): T & U & V;
export declare function deepAssign<T extends {}, U extends {}>(target: T, source: U): T & U;
/**
 * Copies the values of all enumerable (own or inherited) properties of one or more source objects to the
 * target object, recursively copying all nested objects and arrays as well.
 *
 * @param target The target object to receive values from source objects
 * @param sources Any number of objects whose enumerable properties will be copied to the target object
 * @return The modified target object
 */
export declare function deepMixin<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}, Y extends {}, Z extends {}>(target: T, source1: U, source2: V, source3: W, source4: X, source5: Y, source6: Z): T & U & V & W & X & Y & Z;
export declare function deepMixin<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}, Y extends {}>(target: T, source1: U, source2: V, source3: W, source4: X, source5: Y): T & U & V & W & X & Y;
export declare function deepMixin<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}>(target: T, source1: U, source2: V, source3: W, source4: X): T & U & V & W & X;
export declare function deepMixin<T extends {}, U extends {}, V extends {}, W extends {}>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export declare function deepMixin<T extends {}, U extends {}, V extends {}>(target: T, source1: U, source2: V): T & U & V;
export declare function deepMixin<T extends {}, U extends {}>(target: T, source: U): T & U;
/**
 * Creates a new object using the provided source's prototype as the prototype for the new object, and then
 * deep copies the provided source's values into the new target.
 *
 * @param source The object to duplicate
 * @return The new object
 */
export declare function duplicate<T extends {}>(source: T): T;
/**
 * Determines whether two values are the same value.
 *
 * @param a First value to compare
 * @param b Second value to compare
 * @return true if the values are the same; false otherwise
 */
export declare function isIdentical(a: any, b: any): boolean;
/**
 * Returns a function that binds a method to the specified object at runtime. This is similar to
 * `Function.prototype.bind`, but instead of a function it takes the name of a method on an object.
 * As a result, the function returned by `lateBind` will always call the function currently assigned to
 * the specified property on the object as of the moment the function it returns is called.
 *
 * @param instance The context object
 * @param method The name of the method on the context object to bind to itself
 * @param suppliedArgs An optional array of values to prepend to the `instance[method]` arguments list
 * @return The bound function
 */
export declare function lateBind(instance: {}, method: string, ...suppliedArgs: any[]): (...args: any[]) => any;
/**
 * Copies the values of all enumerable (own or inherited) properties of one or more source objects to the
 * target object.
 *
 * @return The modified target object
 */
export declare function mixin<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}, Y extends {}, Z extends {}>(target: T, source1: U, source2: V, source3: W, source4: X, source5: Y, source6: Z): T & U & V & W & X & Y & Z;
export declare function mixin<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}, Y extends {}>(target: T, source1: U, source2: V, source3: W, source4: X, source5: Y): T & U & V & W & X & Y;
export declare function mixin<T extends {}, U extends {}, V extends {}, W extends {}, X extends {}>(target: T, source1: U, source2: V, source3: W, source4: X): T & U & V & W & X;
export declare function mixin<T extends {}, U extends {}, V extends {}, W extends {}>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export declare function mixin<T extends {}, U extends {}, V extends {}>(target: T, source1: U, source2: V): T & U & V;
export declare function mixin<T extends {}, U extends {}>(target: T, source: U): T & U;
/**
 * Returns a function which invokes the given function with the given arguments prepended to its argument list.
 * Like `Function.prototype.bind`, but does not alter execution context.
 *
 * @param targetFunction The function that needs to be bound
 * @param suppliedArgs An optional array of arguments to prepend to the `targetFunction` arguments list
 * @return The bound function
 */
export declare function partial(targetFunction: (...args: any[]) => any, ...suppliedArgs: any[]): (...args: any[]) => any;
/**
 * Returns an object with a destroy method that, when called, calls the passed-in destructor.
 * This is intended to provide a unified interface for creating "remove" / "destroy" handlers for
 * event listeners, timers, etc.
 *
 * @param destructor A function that will be called when the handle's `destroy` method is invoked
 * @return The handle object
 */
export declare function createHandle(destructor: () => void): Handle;
/**
 * Returns a single handle that can be used to destroy multiple handles simultaneously.
 *
 * @param handles An array of handles with `destroy` methods
 * @return The handle object
 */
export declare function createCompositeHandle(...handles: Handle[]): Handle;
