// required for Globalize/Cldr to properly resolve locales in the browser.
import 'cldrjs/dist/cldr/unresolved';
import * as Globalize from 'globalize/dist/globalize';
import supportedLocales from './locales';
import { generateLocales, validateLocale } from '../util/main';
/**
 * A list of all required CLDR packages for an individual locale.
 */
export const mainPackages = Object.freeze([
    'dates/calendars/gregorian',
    'dates/fields',
    'dates/timeZoneNames',
    'numbers',
    'numbers/currencies',
    'units'
]);
/**
 * A list of all required CLDR supplement packages.
 */
export const supplementalPackages = Object.freeze([
    'currencyData',
    'likelySubtags',
    'numberingSystems',
    'plurals-type-cardinal',
    'plurals-type-ordinal',
    'timeData',
    'weekData'
]);
/**
 * @private
 * A simple map containing boolean flags indicating whether a particular CLDR package has been loaded.
 */
const loadCache = {
    main: Object.create(null),
    supplemental: generateSupplementalCache()
};
/**
 * @private
 * Generate the locale-specific data cache from a list of keys. Nested objects will be generated from
 * slash-separated strings.
 *
 * @param cache
 * An empty locale cache object.
 *
 * @param keys
 * The list of keys.
 */
function generateLocaleCache(cache, keys) {
    return keys.reduce((tree, key) => {
        const parts = key.split('/');
        if (parts.length === 1) {
            tree[key] = false;
            return tree;
        }
        parts.reduce((tree, key, i) => {
            if (typeof tree[key] !== 'object') {
                tree[key] = i === parts.length - 1 ? false : Object.create(null);
            }
            return tree[key];
        }, tree);
        return tree;
    }, cache);
}
/**
 * @private
 * Generate the supplemental data cache.
 */
function generateSupplementalCache() {
    return supplementalPackages.reduce((map, key) => {
        map[key] = false;
        return map;
    }, Object.create(null));
}
/**
 * @private
 * Recursively determine whether a list of packages have been loaded for the specified CLDR group.
 *
 * @param group
 * The CLDR group object (e.g., the supplemental data, or a specific locale group)
 *
 * @param args
 * A list of keys to recursively check from left to right. For example, if [ "en", "numbers" ],
 * then `group.en.numbers` must exist for the test to pass.
 *
 * @return
 * `true` if the deepest value exists; `false` otherwise.
 */
function isLoadedForGroup(group, args) {
    return args.every((arg) => {
        const next = group[arg];
        group = next;
        return Boolean(next);
    });
}
/**
 * @private
 * Recursively flag as loaded all recognized keys on the provided CLDR data object.
 *
 * @param cache
 * The load cache (either the entire object, or a nested segment of it).
 *
 * @param localeData
 * The CLDR data object being loaded (either the entire object, or a nested segment of it).
 */
function registerLocaleData(cache, localeData) {
    Object.keys(localeData).forEach((key) => {
        if (key in cache) {
            const value = cache[key];
            if (typeof value === 'boolean') {
                cache[key] = true;
            }
            else {
                registerLocaleData(value, localeData[key]);
            }
        }
    });
}
/**
 * @private
 * Flag all supplied CLDR packages for a specific locale as loaded.
 *
 * @param data
 * The `main` locale data.
 */
function registerMain(data) {
    if (!data) {
        return;
    }
    Object.keys(data).forEach((locale) => {
        if (supportedLocales.indexOf(locale) < 0) {
            return;
        }
        let loadedData = loadCache.main[locale];
        if (!loadedData) {
            loadedData = loadCache.main[locale] = generateLocaleCache(Object.create(null), mainPackages);
        }
        registerLocaleData(loadedData, data[locale]);
    });
}
/**
 * @private
 * Flag all supplied CLDR supplemental packages as loaded.
 *
 * @param data
 * The supplemental data.
 */
function registerSupplemental(data) {
    if (!data) {
        return;
    }
    const supplemental = loadCache.supplemental;
    Object.keys(data).forEach((key) => {
        if (key in supplemental) {
            supplemental[key] = true;
        }
    });
}
/**
 * Determine whether a particular CLDR package has been loaded.
 *
 * Example: to check that `supplemental.likelySubtags` has been loaded, `isLoaded` would be called as
 * `isLoaded('supplemental', 'likelySubtags')`.
 *
 * @param groupName
 * The group to check; either "main" or "supplemental".
 *
 * @param ...args
 * Any remaining keys in the path to the desired package.
 *
 * @return
 * `true` if the deepest value exists; `false` otherwise.
 */
export function isLoaded(groupName, ...args) {
    let group = loadCache[groupName];
    if (groupName === 'main' && args.length > 0) {
        const locale = args[0];
        if (!validateLocale(locale)) {
            return false;
        }
        args = args.slice(1);
        return generateLocales(locale).some((locale) => {
            const next = group[locale];
            return next ? isLoadedForGroup(next, args) : false;
        });
    }
    return isLoadedForGroup(group, args);
}
/**
 * Load the specified CLDR data with the i18n ecosystem.
 *
 * @param data
 * A data object containing `main` and/or `supplemental` objects with CLDR data.
 */
export default function loadCldrData(data) {
    registerMain(data.main);
    registerSupplemental(data.supplemental);
    Globalize.load(data);
    return Promise.resolve();
}
/**
 * Clear the load cache, either the entire cache for the specified group. After calling this method,
 * `isLoaded` will return false for keys within the specified group(s).
 *
 * @param group
 * An optional group name. If not provided, then both the "main" and "supplemental" caches will be cleared.
 */
export function reset(group) {
    if (group !== 'supplemental') {
        loadCache.main = Object.create(null);
    }
    if (group !== 'main') {
        loadCache.supplemental = generateSupplementalCache();
    }
}
//# sourceMappingURL=load.mjs.map