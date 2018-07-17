import 'globalize/dist/globalize';
import i18n from '../i18n';
// TODO: use normal imports after landing https://github.com/DefinitelyTyped/DefinitelyTyped/pull/27271
const Globalize = require('globalize/dist/globalize');
/**
 * @private
 * Normalize an array of formatter arguments into a discrete object with `locale`, `options`, `value` and
 * `unit` properties for use with the various Globalize.js formatter methods.
 *
 * @param args
 * An object with an optional locale, options, value, and/or unit.
 *
 * @return
 * The normalized object map.
 */
function normalizeFormatterArguments(args) {
    let { locale, optionsOrLocale, unit, value } = args;
    let options = optionsOrLocale;
    if (typeof optionsOrLocale === 'string') {
        locale = optionsOrLocale;
        options = undefined;
    }
    return { locale, options, unit, value };
}
/**
 * Return a Globalize.js object for the specified locale. If no locale is provided, then the root
 * locale is assumed.
 *
 * @param string
 * An optional locale for the Globalize.js object.
 *
 * @return
 * The localized Globalize.js object.
 */
export default function getGlobalize(locale) {
    return locale && locale !== i18n.locale ? new Globalize(locale) : Globalize;
}
export function globalizeDelegator(method, args) {
    const { locale, options, value, unit } = normalizeFormatterArguments(args);
    const methodArgs = typeof value !== 'undefined' ? [value] : [];
    if (typeof unit !== 'undefined') {
        methodArgs.push(unit);
    }
    if (typeof options !== 'undefined') {
        methodArgs.push(options);
    }
    const globalize = getGlobalize(locale);
    return globalize[method].apply(globalize, methodArgs);
}
//# sourceMappingURL=globalize.mjs.map