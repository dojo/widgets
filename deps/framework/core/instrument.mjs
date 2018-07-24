import has from './has';
/**
 * The default message to warn when no other is provided
 */
const DEFAULT_DEPRECATED_MESSAGE = 'This function will be removed in future versions.';
/**
 * When set, globalWarn will be used instead of `console.warn`
 */
let globalWarn;
/**
 * A function that will console warn that a function has been deprecated
 *
 * @param options Provide options which change the display of the message
 */
export function deprecated({ message, name, warn, url } = {}) {
    /* istanbul ignore else: testing with debug off is difficult */
    if (has('debug')) {
        message = message || DEFAULT_DEPRECATED_MESSAGE;
        let warning = `DEPRECATED: ${name ? name + ': ' : ''}${message}`;
        if (url) {
            warning += `\n\n    See ${url} for more details.\n\n`;
        }
        if (warn) {
            warn(warning);
        }
        else if (globalWarn) {
            globalWarn(warning);
        }
        else {
            console.warn(warning);
        }
    }
}
/**
 * A function that generates before advice that can be used to warn when an API has been deprecated
 *
 * @param options Provide options which change the display of the message
 */
export function deprecatedAdvice(options) {
    return function (...args) {
        deprecated(options);
        return args;
    };
}
/**
 * A method decorator that will console warn when a method if invoked that is deprecated
 *
 * @param options Provide options which change the display of the message
 */
export function deprecatedDecorator(options) {
    return function (target, propertyKey, descriptor) {
        if (has('debug')) {
            const { value: originalFn } = descriptor;
            options = options || {};
            propertyKey = String(propertyKey);
            /* IE 10/11 don't have the name property on functions */
            options.name = target.constructor.name ? `${target.constructor.name}#${propertyKey}` : propertyKey;
            descriptor.value = function (...args) {
                deprecated(options);
                return originalFn.apply(target, args);
            };
        }
        return descriptor;
    };
}
/**
 * A function that will set the warn function that will be used instead of `console.warn` when
 * logging warning messages
 *
 * @param warn The function (or `undefined`) to use instead of `console.warn`
 */
export function setWarn(warn) {
    globalWarn = warn;
}
//# sourceMappingURL=instrument.mjs.map