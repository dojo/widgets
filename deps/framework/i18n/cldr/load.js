(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "cldrjs/dist/cldr/unresolved", "globalize/dist/globalize", "./locales", "../util/main"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // required for Globalize/Cldr to properly resolve locales in the browser.
    require("cldrjs/dist/cldr/unresolved");
    var Globalize = require("globalize/dist/globalize");
    var locales_1 = require("./locales");
    var main_1 = require("../util/main");
    /**
     * A list of all required CLDR packages for an individual locale.
     */
    exports.mainPackages = Object.freeze([
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
    exports.supplementalPackages = Object.freeze([
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
    var loadCache = {
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
        return keys.reduce(function (tree, key) {
            var parts = key.split('/');
            if (parts.length === 1) {
                tree[key] = false;
                return tree;
            }
            parts.reduce(function (tree, key, i) {
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
        return exports.supplementalPackages.reduce(function (map, key) {
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
        return args.every(function (arg) {
            var next = group[arg];
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
        Object.keys(localeData).forEach(function (key) {
            if (key in cache) {
                var value = cache[key];
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
        Object.keys(data).forEach(function (locale) {
            if (locales_1.default.indexOf(locale) < 0) {
                return;
            }
            var loadedData = loadCache.main[locale];
            if (!loadedData) {
                loadedData = loadCache.main[locale] = generateLocaleCache(Object.create(null), exports.mainPackages);
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
        var supplemental = loadCache.supplemental;
        Object.keys(data).forEach(function (key) {
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
    function isLoaded(groupName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var group = loadCache[groupName];
        if (groupName === 'main' && args.length > 0) {
            var locale = args[0];
            if (!main_1.validateLocale(locale)) {
                return false;
            }
            args = args.slice(1);
            return main_1.generateLocales(locale).some(function (locale) {
                var next = group[locale];
                return next ? isLoadedForGroup(next, args) : false;
            });
        }
        return isLoadedForGroup(group, args);
    }
    exports.isLoaded = isLoaded;
    /**
     * Load the specified CLDR data with the i18n ecosystem.
     *
     * @param data
     * A data object containing `main` and/or `supplemental` objects with CLDR data.
     */
    function loadCldrData(data) {
        registerMain(data.main);
        registerSupplemental(data.supplemental);
        Globalize.load(data);
        return Promise.resolve();
    }
    exports.default = loadCldrData;
    /**
     * Clear the load cache, either the entire cache for the specified group. After calling this method,
     * `isLoaded` will return false for keys within the specified group(s).
     *
     * @param group
     * An optional group name. If not provided, then both the "main" and "supplemental" caches will be cleared.
     */
    function reset(group) {
        if (group !== 'supplemental') {
            loadCache.main = Object.create(null);
        }
        if (group !== 'main') {
            loadCache.supplemental = generateSupplementalCache();
        }
    }
    exports.reset = reset;
});
//# sourceMappingURL=load.js.map