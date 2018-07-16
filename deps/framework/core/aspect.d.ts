import { Handle } from './interfaces';
/**
 * An object that provides the necessary APIs to be MapLike
 */
export interface MapLike<K, V> {
    get(key: K): V;
    set(key: K, value?: V): this;
}
export interface Indexable {
    [method: string]: any;
}
/**
 * The types of objects or maps where advice can be applied
 */
export declare type Targetable = MapLike<string | symbol, any> | Indexable;
export interface JoinPointDispatchAdvice<T> {
    before?: JoinPointBeforeAdvice[];
    after?: JoinPointAfterAdvice<T>[];
    readonly joinPoint: Function;
}
export interface JoinPointAfterAdvice<T> {
    /**
     * Advice which is applied *after*, receiving the result and arguments from the join point.
     *
     * @param result The result from the function being advised
     * @param args The arguments that were supplied to the advised function
     * @returns The value returned from the advice is then the result of calling the method
     */
    (result: T, ...args: any[]): T;
}
export interface JoinPointAroundAdvice<T> {
    /**
     * Advice which is applied *around*.  The advising function receives the original function and
     * needs to return a new function which will then invoke the original function.
     *
     * @param origFn The original function
     * @returns A new function which will invoke the original function.
     */
    (origFn: GenericFunction<T>): (...args: any[]) => T;
}
export interface JoinPointBeforeAdvice {
    /**
     * Advice which is applied *before*, receiving the original arguments, if the advising
     * function returns a value, it is passed further along taking the place of the original
     * arguments.
     *
     * @param args The arguments the method was called with
     */
    (...args: any[]): any[] | void;
}
export interface GenericFunction<T> {
    (...args: any[]): T;
}
/**
 * Attaches "after" advice to be executed after the original method.
 * The advising function will receive the original method's return value and arguments object.
 * The value it returns will be returned from the method when it is called (even if the return value is undefined).
 *
 * @param target Object whose method will be aspected
 * @param methodName Name of method to aspect
 * @param advice Advising function which will receive the original method's return value and arguments object
 * @return A handle which will remove the aspect when destroy is called
 */
export declare function after(target: Targetable, methodName: string | symbol, advice: (originalReturn: any, originalArgs: IArguments) => any): Handle;
/**
 * Apply advice *after* the supplied joinPoint (function)
 *
 * @param joinPoint A function that should have advice applied to
 * @param advice The after advice
 */
export declare function after<F extends GenericFunction<T>, T>(joinPoint: F, advice: JoinPointAfterAdvice<T>): F;
/**
 * Apply advice *around* the supplied joinPoint (function)
 *
 * @param joinPoint A function that should have advice applied to
 * @param advice The around advice
 */
export declare function aroundJoinPoint<F extends GenericFunction<T>, T>(joinPoint: F, advice: JoinPointAroundAdvice<T>): F;
/**
 * Attaches "around" advice around the original method.
 *
 * @param target Object whose method will be aspected
 * @param methodName Name of method to aspect
 * @param advice Advising function which will receive the original function
 * @return A handle which will remove the aspect when destroy is called
 */
export declare function aroundObject(target: Targetable, methodName: string | symbol, advice: ((previous: Function) => Function)): Handle;
/**
 * Attaches "around" advice around the original method.
 *
 * @param target Object whose method will be aspected
 * @param methodName Name of method to aspect
 * @param advice Advising function which will receive the original function
 * @return A handle which will remove the aspect when destroy is called
 */
export declare function around(target: Targetable, methodName: string | symbol, advice: ((previous: Function) => Function)): Handle;
/**
 * Apply advice *around* the supplied joinPoint (function)
 *
 * @param joinPoint A function that should have advice applied to
 * @param advice The around advice
 */
export declare function around<F extends GenericFunction<T>, T>(joinPoint: F, advice: JoinPointAroundAdvice<T>): F;
/**
 * Apply advice *before* the supplied joinPoint (function)
 *
 * @param joinPoint A function that should have advice applied to
 * @param advice The before advice
 */
export declare function beforeJoinPoint<F extends GenericFunction<any>>(joinPoint: F, advice: JoinPointBeforeAdvice): F;
/**
 * Attaches "before" advice to be executed before the original method.
 *
 * @param target Object whose method will be aspected
 * @param methodName Name of method to aspect
 * @param advice Advising function which will receive the same arguments as the original, and may return new arguments
 * @return A handle which will remove the aspect when destroy is called
 */
export declare function beforeObject(target: Targetable, methodName: string | symbol, advice: (...originalArgs: any[]) => any[] | void): Handle;
/**
 * Attaches "before" advice to be executed before the original method.
 *
 * @param target Object whose method will be aspected
 * @param methodName Name of method to aspect
 * @param advice Advising function which will receive the same arguments as the original, and may return new arguments
 * @return A handle which will remove the aspect when destroy is called
 */
export declare function before(target: Targetable, methodName: string | symbol, advice: (...originalArgs: any[]) => any[] | void): Handle;
/**
 * Apply advice *before* the supplied joinPoint (function)
 *
 * @param joinPoint A function that should have advice applied to
 * @param advice The before advice
 */
export declare function before<F extends GenericFunction<any>>(joinPoint: F, advice: JoinPointBeforeAdvice): F;
/**
 * Attaches advice to be executed after the original method.
 * The advising function will receive the same arguments as the original method.
 * The value it returns will be returned from the method when it is called *unless* its return value is undefined.
 *
 * @param target Object whose method will be aspected
 * @param methodName Name of method to aspect
 * @param advice Advising function which will receive the same arguments as the original method
 * @return A handle which will remove the aspect when destroy is called
 */
export declare function on(target: Targetable, methodName: string | symbol, advice: (...originalArgs: any[]) => any): Handle;
