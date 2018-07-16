import { Handle } from '../core/interfaces';
/**
 * A default bundle used as basis for loading locale-specific bundles.
 */
export interface Bundle<T extends Messages> {
    /**
     * A unique identifier for the bundle that will be generated automatically when it is registered.
     */
    readonly id?: string;
    /**
     * A list of supported locales. Any included locale MUST have an associated bundle.
     */
    readonly locales?: LocaleLoaders<T>;
    /**
     * The map of default messages that will be used when locale-specific messages are unavailable.
     * Note that any message key used in the i18n system MUST have a default specified here.
     */
    readonly messages: T;
}
/**
 * Options object passed to message formatters and used for token replacement.
 */
export interface FormatOptions {
    [key: string]: any;
}
export interface I18n<T extends Messages> {
    (bundle: Bundle<T>, locale?: string): Promise<T>;
    /**
     * The current namespace as set via `switchLocale`. Defaults to `systemLocale`.
     */
    readonly locale: string;
}
/**
 * A map of locales to functions responsible for loading their respective translations.
 */
export interface LocaleLoaders<T extends Messages> {
    [locale: string]: () => LocaleTranslations<T> | Promise<LocaleTranslations<T>>;
}
/**
 * An object of locale-specific translations.
 */
export declare type LocaleTranslations<T extends Messages> = Partial<T> | {
    default?: Partial<T>;
};
/**
 * Describes a compiled ICU message formatter function.
 */
export interface MessageFormatter {
    (options?: FormatOptions): string;
}
/**
 * An object of keys to locale messages.
 */
export interface Messages {
    [key: string]: string;
}
/**
 * Return a formatted message.
 *
 * If both the "supplemental/likelySubtags" and "supplemental/plurals-type-cardinal" CLDR data have been loaded, then
 * the ICU message format is supported. Otherwise, a simple token-replacement mechanism is used.
 *
 * Usage:
 * formatMessage(bundle, 'guestInfo', {
 *   host: 'Bill',
 *   guest: 'John'
 * }, 'fr');
 *
 * @param bundle
 * The bundle containing the target message.
 *
 * @param key
 * The message's key.
 *
 * @param options
 * An optional value used by the formatter to replace tokens with values.
 *
 * @param locale
 * An optional locale for the formatter. If no locale is supplied, or if the locale is not supported, the
 * default locale is used.
 *
 * @return
 * The formatted message.
 */
export declare function formatMessage<T extends Messages>(bundle: Bundle<T>, key: string, options?: FormatOptions, locale?: string): string;
/**
 * Return the cached messages for the specified bundle and locale. If messages have not been previously loaded for the
 * specified locale, no value will be returned.
 *
 * @param bundle
 * The default bundle that is used to determine where the locale-specific bundles are located.
 *
 * @param locale
 * The locale of the desired messages.
 *
 * @return The cached messages object, if it exists.
 */
export declare function getCachedMessages<T extends Messages>(bundle: Bundle<T>, locale: string): T | void;
/**
 * Return a function that formats a specific message, and takes an optional value for token replacement.
 *
 * If both the "supplemental/likelySubtags" and "supplemental/plurals-type-cardinal" CLDR data have been loaded, then
 * the returned function will have ICU message format support. Otherwise, the returned function will perform a simple
 * token replacement on the message string.
 *
 * Usage:
 * const formatter = getMessageFormatter(bundle, 'guestInfo', 'fr');
 * const message = formatter({
 *   host: 'Miles',
 *   gender: 'male',
 *   guest: 'Oscar',
 *   guestCount: '15'
 * });
 *
 * @param bundle
 * The bundle containing the target message.
 *
 * @param key
 * The message's key.
 *
 * @param locale
 * An optional locale for the formatter. If no locale is supplied, or if the locale is not supported, the
 * default locale is used.
 *
 * @return
 * The message formatter.
 */
export declare function getMessageFormatter<T extends Messages>(bundle: Bundle<T>, key: string, locale?: string): MessageFormatter;
declare const _default: I18n<Messages>;
export default _default;
/**
 * Invalidate the cache for a particular bundle, or invalidate the entire cache. Note that cached messages for all
 * locales for a given bundle will be cleared.
 *
 * @param bundle
 * An optional bundle to invalidate. If no bundle is provided, then the cache is cleared for all bundles.
 */
export declare function invalidate<T extends Messages>(bundle?: Bundle<T>): void;
/**
 * Register an observer to be notified when the root locale changes.
 *
 * @param callback
 * A callback function which will receive the updated locale string on updates.
 *
 * @return
 * A handle object that can be used to unsubscribe from updates.
 */
export declare const observeLocale: (callback: (locale: string) => {}) => Handle;
/**
 * Pre-load locale-specific messages into the i18n system.
 *
 * @param bundle
 * The default bundle that is used to merge locale-specific messages with the default messages.
 *
 * @param messages
 * The messages to cache.
 *
 * @param locale
 * The locale for the messages
 */
export declare function setLocaleMessages<T extends Messages>(bundle: Bundle<T>, localeMessages: Partial<T>, locale: string): void;
/**
 * Change the root locale, and notify any registered observers.
 *
 * @param locale
 * The new locale.
 */
export declare function switchLocale(locale: string): void;
/**
 * The default environment locale.
 *
 * It should be noted that while the system locale will be normalized to a single
 * format when loading message bundles, this value represents the unaltered
 * locale returned directly by the environment.
 */
export declare const systemLocale: string;
