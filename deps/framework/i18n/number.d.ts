import 'globalize/dist/globalize';
import 'globalize/dist/globalize/number';
import 'globalize/dist/globalize/plural';
import 'globalize/dist/globalize/currency';
export declare type CurrencyStyleOption = 'accounting' | 'code' | 'name' | 'symbol';
export declare type NumberStyleOption = 'decimal' | 'percent';
export declare type PluralGroup = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
export declare type PluralTypeOption = 'cardinal' | 'ordinal';
export declare type RoundNumberOption = 'ceil' | 'floor' | 'round' | 'truncate';
export interface CommonNumberFormatterOptions {
    /**
     * Non-negative integer Number value indicating the minimum integer digits to be used. Numbers will be padded with
     * leading zeroes if necessary.
     */
    minimumIntegerDigits?: number;
    /**
     * Non-negative integer Number values indicating the minimum and maximum fraction digits to be used.
     * Numbers will be rounded or padded with trailing zeroes if necessary.
     * Either one or both of these properties must be present.
     * If they are, they will override minimum and maximum fraction digits derived from the CLDR patterns.
     */
    minimumFractionDigits?: number;
    /**
     * Non-negative integer Number values indicating the minimum and maximum fraction digits to be used.
     * Numbers will be rounded or padded with trailing zeroes if necessary.
     * Either one or both of these properties must be present.
     * If they are, they will override minimum and maximum fraction digits derived from the CLDR patterns.
     */
    maximumFractionDigits?: number;
    /**
     * Positive integer Number values indicating the minimum and maximum fraction digits to be shown.
     * Either none or both of these properties are present
     * If they are, they override minimum and maximum integer and fraction digits.
     * The formatter uses however many integer and fraction digits are required to display the specified number of
     * significant digits.
     */
    minimumSignificantDigits?: number;
    /**
     * Positive integer Number values indicating the minimum and maximum fraction digits to be shown.
     * Either none or both of these properties are present.
     * If they are, they override minimum and maximum integer and fraction digits.
     * The formatter uses however many integer and fraction digits are required to display the specified number of
     * significant digits.
     */
    maximumSignificantDigits?: number;
    /**
     * String with rounding method ceil, floor, round (default), or truncate.
     */
    round?: RoundNumberOption;
    /**
     * Boolean (default is true) value indicating whether a grouping separator should be used.
     */
    useGrouping?: boolean;
}
export declare type CurrencyFormatterOptions = CommonNumberFormatterOptions & {
    /**
     * symbol (default), accounting, code or name.
     */
    style?: CurrencyStyleOption;
};
export interface NumberFormatter {
    /**
     * Any function that formats a number as string.
     */
    (value: number): string;
}
export declare type NumberFormatterOptions = CommonNumberFormatterOptions & {
    /**
     * decimal (default), or percent
     */
    style?: NumberStyleOption;
};
export interface NumberParser {
    /**
     * Any function that parses a number value from a string.
     */
    (value: string): number;
}
export declare type NumberParserOptions = {
    /**
     * decimal (default), or percent.
     */
    style?: NumberStyleOption;
};
export declare type PluralGeneratorOptions = {
    /**
     * cardinal (default), or ordinal.
     */
    type?: PluralTypeOption;
};
/**
 * Format a number as the specified currency, according to the specified configuration and or locale.
 *
 * @param value
 * The number to format.
 *
 * @param currency
 * The currency to which the number should be converted.
 *
 * @param options
 * An optional configuration of settings that determine how the currency string will be formatted.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * The formatted currency string.
 */
export declare function formatCurrency(value: number, currency: string, options?: CurrencyFormatterOptions, locale?: string): string;
export declare function formatCurrency(value: number, currency: string, locale?: string): string;
/**
 * Format a number according to the specified configuration and or locale.
 *
 * @param value
 * The number to format.
 *
 * @param options
 * An optional configuration of settings that determine how the number string will be formatted.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * The formatted number string.
 */
export declare function formatNumber(value: number, options?: NumberFormatterOptions, locale?: string): string;
export declare function formatNumber(value: number, locale?: string): string;
/**
 * Return a function that formats a number as the specified currency, according to the specified configuration
 * and or locale.
 *
 * @param currency
 * The currency to which the number should be converted.
 *
 * @param options
 * An optional configuration of settings that determine how the currency string will be formatted.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a number and returns a formatted currency string.
 */
export declare function getCurrencyFormatter(currency: string, options?: CurrencyFormatterOptions, locale?: string): NumberFormatter;
export declare function getCurrencyFormatter(currency: string, locale?: string): NumberFormatter;
/**
 * Return a function that formats a number according to the specified configuration and or locale.
 *
 * @param options
 * An optional configuration of settings that determine how the number string will be formatted.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a number and returns a formatted string.
 */
export declare function getNumberFormatter(options?: NumberFormatterOptions, locale?: string): NumberFormatter;
export declare function getNumberFormatter(locale?: string): NumberFormatter;
/**
 * Parse a number from a string based on the provided configuration and or locale.
 *
 * @param options
 * An optional config that describes the format of the string.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * The parsed number.
 */
export declare function getNumberParser(options?: NumberFormatterOptions, locale?: string): NumberParser;
export declare function getNumberParser(locale?: string): NumberParser;
/**
 * Return a function that accepts a number and returns that number's plural group.
 *
 * @param options
 * An optional configuration that determines whether the numerical value should be treated as a cardinal
 * or ordinal number.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a number and returns the corresponding plural group.
 */
export declare function getPluralGenerator(options?: PluralGeneratorOptions, locale?: string): NumberFormatter;
export declare function getPluralGenerator(locale?: string): NumberFormatter;
/**
 * Return a function that parses a number from a string based on the provided configuration and or locale.
 *
 * @param value
 * The string to parse.
 *
 * @param options
 * An optional config that describes the format of the string.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * A function that accepts a string and returns a number.
 */
export declare function parseNumber(value: string, options?: NumberFormatterOptions, locale?: string): number;
export declare function parseNumber(value: string, locale?: string): number;
/**
 * Return the plural group from a number.
 *
 * @param value
 * The number.
 *
 * @param options
 * An optional configuration that determines whether the numerical value should be treated as a cardinal
 * or ordinal number.
 *
 * @param locale
 * An optional locale. Defaults to the root locale.
 *
 * @return
 * The plural group.
 */
export declare function pluralize(value: number, options?: PluralGeneratorOptions, locale?: string): string;
export declare function pluralize(value: number, locale?: string): string;
