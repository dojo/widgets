export interface DeprecatedOptions {
    /**
     * The message to use when warning
     */
    message?: string;
    /**
     * The name of the method or function to use
     */
    name?: string;
    /**
     * An alternative function to log the warning to
     */
    warn?: (...args: any[]) => void;
    /**
     * Reference an URL for more information when warning
     */
    url?: string;
}
/**
 * A function that will console warn that a function has been deprecated
 *
 * @param options Provide options which change the display of the message
 */
export declare function deprecated({message, name, warn, url}?: DeprecatedOptions): void;
/**
 * A function that generates before advice that can be used to warn when an API has been deprecated
 *
 * @param options Provide options which change the display of the message
 */
export declare function deprecatedAdvice(options?: DeprecatedOptions): (...args: any[]) => any[];
/**
 * A method decorator that will console warn when a method if invoked that is deprecated
 *
 * @param options Provide options which change the display of the message
 */
export declare function deprecatedDecorator(options?: DeprecatedOptions): MethodDecorator;
/**
 * A function that will set the warn function that will be used instead of `console.warn` when
 * logging warning messages
 *
 * @param warn The function (or `undefined`) to use instead of `console.warn`
 */
export declare function setWarn(warn?: ((message?: any, ...optionalParams: any[]) => void)): void;
