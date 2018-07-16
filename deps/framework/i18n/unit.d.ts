import 'globalize/dist/globalize';
import 'globalize/dist/globalize/number';
import 'globalize/dist/globalize/plural';
import 'globalize/dist/globalize/unit';
import { NumberFormatter } from './number';
export declare type UnitLength = 'long' | 'narrow' | 'short';
export declare type UnitFormatterOptions = {
    /**
     * form: [String] eg. "long", "short" or "narrow".
     */
    form?: UnitLength;
    /**
     * numberFormatter: [Function] a number formatter function. Defaults to Globalize .numberFormatter() for the current locale using the default options.
     */
    numberFormatter?: NumberFormatter;
};
/**
 * Return a string formatted for the specified number, unit, and options/locale.
 *
 * @param value
 * The number of units.
 *
 * @param unit
 * The unit, singular (e.g., "day", "meter", "foot").
 *
 * @param options
 * An optional configuration object that determines how the number and unit are formatted.
 *
 * @param locale
 * The optional locale. Defaults to the root locale.
 *
 * @return
 * The formatted string.
 */
export declare function formatUnit(value: number, unit: string, options?: UnitFormatterOptions, locale?: string): string;
export declare function formatUnit(value: number, unit: string, locale?: string): string;
/**
 * Return a function that formats a number according to specified unit and options/locale.
 *
 * @param unit
 * The unit, singular (e.g., "day", "meter", "foot").
 *
 * @param options
 * An optional configuration object that determines how the number and unit are formatted.
 *
 * @param locale
 * The optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a number and returns a string formatted according to the specified unit and options/locale.
 */
export declare function getUnitFormatter(unit: string, options?: UnitFormatterOptions, locale?: string): NumberFormatter;
export declare function getUnitFormatter(unit: string, locale?: string): NumberFormatter;
