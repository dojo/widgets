import 'globalize/dist/globalize';
import * as GlobalizeType from 'globalize';
export interface DelegatorOptions<O> {
    locale?: string;
    optionsOrLocale?: O | string;
}
export interface FormatterDelegatorOptions<T, O> extends DelegatorOptions<O> {
    unit?: string;
    value?: T;
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
export default function getGlobalize(locale?: string): GlobalizeType.Static;
/**
 * Call the specified Globalize.js method with the specified value, unit, and options, for the specified locale.
 *
 * @param method
 * The name of the static method on the `Globalize` object (required).
 *
 * @param args
 * An object containing any locale, options, value, or unit required by the underlying Globalize.js method.
 *
 * @return
 * The value returned by the underlying Globalize.js method.
 */
export declare function globalizeDelegator<O, R>(method: string, args: DelegatorOptions<O>): R;
export declare function globalizeDelegator<T, O, R>(method: string, args: FormatterDelegatorOptions<T, O>): R;
