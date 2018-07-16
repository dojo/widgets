/**
 * Helper function to generate a value property descriptor
 *
 * @param value        The value the property descriptor should be set to
 * @param enumerable   If the property should be enumberable, defaults to false
 * @param writable     If the property should be writable, defaults to true
 * @param configurable If the property should be configurable, defaults to true
 * @return             The property descriptor object
 */
export declare function getValueDescriptor<T>(value: T, enumerable?: boolean, writable?: boolean, configurable?: boolean): TypedPropertyDescriptor<T>;
/**
 * A helper function which wraps a function where the first argument becomes the scope
 * of the call
 *
 * @param nativeFunction The source function to be wrapped
 */
export declare function wrapNative<T, U, R>(nativeFunction: (arg1: U) => R): (target: T, arg1: U) => R;
export declare function wrapNative<T, U, V, R>(nativeFunction: (arg1: U, arg2: V) => R): (target: T, arg1: U, arg2: V) => R;
export declare function wrapNative<T, U, V, W, R>(nativeFunction: (arg1: U, arg2: V, arg3: W) => R): (target: T, arg1: U, arg2: V, arg3: W) => R;
export declare function wrapNative<T, U, V, W, X, R>(nativeFunction: (arg1: U, arg2: V, arg3: W) => R): (target: T, arg1: U, arg2: V, arg3: W) => R;
export declare function wrapNative<T, U, V, W, X, Y, R>(nativeFunction: (arg1: U, arg2: V, arg3: W, arg4: Y) => R): (target: T, arg1: U, arg2: V, arg3: W, arg4: Y) => R;
