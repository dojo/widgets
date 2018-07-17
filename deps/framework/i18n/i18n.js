(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "globalize/dist/globalize/message", "../shim/global", "../shim/Map", "../core/Evented", "../core/has", "../core/uuid", "../core/load/util", "./cldr/load", "./util/main"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /* tslint:disable:interface-name */
    require("globalize/dist/globalize/message");
    var global_1 = require("../shim/global");
    var Map_1 = require("../shim/Map");
    var Evented_1 = require("../core/Evented");
    var has_1 = require("../core/has");
    var uuid_1 = require("../core/uuid");
    var util_1 = require("../core/load/util");
    var load_1 = require("./cldr/load");
    var main_1 = require("./util/main");
    // TODO: use normal imports after landing https://github.com/DefinitelyTyped/DefinitelyTyped/pull/27271
    var Globalize = require('globalize/dist/globalize');
    var TOKEN_PATTERN = /\{([a-z0-9_]+)\}/gi;
    var bundleMap = new Map_1.default();
    var formatterMap = new Map_1.default();
    var localeProducer = new Evented_1.default();
    var rootLocale;
    /**
     * Return the bundle's unique identifier, creating one if it does not already exist.
     *
     * @param bundle A message bundle
     * @return The bundle's unique identifier
     */
    function getBundleId(bundle) {
        if (bundle.id) {
            return bundle.id;
        }
        var id = uuid_1.default();
        Object.defineProperty(bundle, 'id', {
            value: id
        });
        return id;
    }
    /**
     * @private
     * Return a function that formats an ICU-style message, and takes an optional value for token replacement.
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
     * @param id
     * The message's bundle id.
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
    function getIcuMessageFormatter(id, key, locale) {
        locale = main_1.normalizeLocale(locale || getRootLocale());
        var formatterKey = locale + ":" + id + ":" + key;
        var formatter = formatterMap.get(formatterKey);
        if (formatter) {
            return formatter;
        }
        var globalize = locale !== getRootLocale() ? new Globalize(main_1.normalizeLocale(locale)) : Globalize;
        formatter = globalize.messageFormatter(id + "/" + key);
        var cached = bundleMap.get(id);
        if (cached && cached.get(locale)) {
            formatterMap.set(formatterKey, formatter);
        }
        return formatter;
    }
    /**
     * @private
     * Load the specified locale-specific bundles, mapping the default exports to simple `Messages` objects.
     */
    function loadLocaleBundles(locales, supported) {
        return Promise.all(supported.map(function (locale) { return locales[locale](); })).then(function (bundles) {
            return bundles.map(function (bundle) { return util_1.useDefault(bundle); });
        });
    }
    /**
     * @private
     * Return the root locale. Defaults to the system locale.
     */
    function getRootLocale() {
        return rootLocale || exports.systemLocale;
    }
    /**
     * @private
     * Retrieve a list of supported locales that can provide messages for the specified locale.
     *
     * @param locale
     * The target locale.
     *
     * @param supported
     * The locales that are supported by the bundle.
     *
     * @return
     * A list of supported locales that match the target locale.
     */
    function getSupportedLocales(locale, supported) {
        if (supported === void 0) { supported = []; }
        return main_1.generateLocales(locale).filter(function (locale) { return supported.indexOf(locale) > -1; });
    }
    /**
     * @private
     * Inject messages for the specified locale into the i18n system.
     *
     * @param id
     * The bundle's unique identifier
     *
     * @param messages
     * The messages to inject
     *
     * @param locale
     * An optional locale. If not specified, then it is assumed that the messages are the defaults for the given
     * bundle path.
     */
    function loadMessages(id, messages, locale) {
        if (locale === void 0) { locale = 'root'; }
        var cached = bundleMap.get(id);
        if (!cached) {
            cached = new Map_1.default();
            bundleMap.set(id, cached);
        }
        cached.set(locale, messages);
        Globalize.loadMessages((_a = {},
            _a[locale] = (_b = {},
                _b[id] = messages,
                _b),
            _a));
        var _a, _b;
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
    function formatMessage(bundle, key, options, locale) {
        return getMessageFormatter(bundle, key, locale)(options);
    }
    exports.formatMessage = formatMessage;
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
    function getCachedMessages(bundle, locale) {
        var _a = bundle.id, id = _a === void 0 ? getBundleId(bundle) : _a, locales = bundle.locales, messages = bundle.messages;
        var cached = bundleMap.get(id);
        if (!cached) {
            loadMessages(id, messages);
        }
        else {
            var localeMessages = cached.get(locale);
            if (localeMessages) {
                return localeMessages;
            }
        }
        var supportedLocales = getSupportedLocales(locale, locales && Object.keys(locales));
        if (!supportedLocales.length) {
            return messages;
        }
        if (cached) {
            return cached.get(supportedLocales[supportedLocales.length - 1]);
        }
    }
    exports.getCachedMessages = getCachedMessages;
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
    function getMessageFormatter(bundle, key, locale) {
        var _a = bundle.id, id = _a === void 0 ? getBundleId(bundle) : _a;
        if (load_1.isLoaded('supplemental', 'likelySubtags') && load_1.isLoaded('supplemental', 'plurals-type-cardinal')) {
            return getIcuMessageFormatter(id, key, locale);
        }
        var cached = bundleMap.get(id);
        var messages = cached ? cached.get(locale || getRootLocale()) || cached.get('root') : null;
        if (!messages) {
            throw new Error("The bundle has not been registered.");
        }
        return function (options) {
            if (options === void 0) { options = Object.create(null); }
            return messages[key].replace(TOKEN_PATTERN, function (token, property) {
                var value = options[property];
                if (typeof value === 'undefined') {
                    throw new Error("Missing property " + property);
                }
                return value;
            });
        };
    }
    exports.getMessageFormatter = getMessageFormatter;
    /**
     * Load locale-specific messages for the specified bundle and locale.
     *
     * @param bundle
     * The default bundle that is used to determine where the locale-specific bundles are located.
     *
     * @param locale
     * An optional locale. If no locale is provided, then the current locale is assumed.
     *
     * @return A promise to the locale-specific messages.
     */
    function i18n(bundle, locale) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentLocale, cachedMessages, locales, supportedLocales, bundles;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentLocale = locale ? main_1.normalizeLocale(locale) : getRootLocale();
                        cachedMessages = getCachedMessages(bundle, currentLocale);
                        if (cachedMessages) {
                            return [2 /*return*/, cachedMessages];
                        }
                        locales = bundle.locales;
                        supportedLocales = getSupportedLocales(currentLocale, Object.keys(locales));
                        return [4 /*yield*/, loadLocaleBundles(locales, supportedLocales)];
                    case 1:
                        bundles = _a.sent();
                        return [2 /*return*/, bundles.reduce(function (previous, partial) {
                                var localeMessages = tslib_1.__assign({}, previous, partial);
                                loadMessages(getBundleId(bundle), Object.freeze(localeMessages), currentLocale);
                                return localeMessages;
                            }, bundle.messages)];
                }
            });
        });
    }
    Object.defineProperty(i18n, 'locale', {
        get: getRootLocale
    });
    exports.default = i18n;
    /**
     * Invalidate the cache for a particular bundle, or invalidate the entire cache. Note that cached messages for all
     * locales for a given bundle will be cleared.
     *
     * @param bundle
     * An optional bundle to invalidate. If no bundle is provided, then the cache is cleared for all bundles.
     */
    function invalidate(bundle) {
        if (bundle) {
            bundle.id && bundleMap.delete(bundle.id);
        }
        else {
            bundleMap.clear();
        }
    }
    exports.invalidate = invalidate;
    /**
     * Register an observer to be notified when the root locale changes.
     *
     * @param callback
     * A callback function which will receive the updated locale string on updates.
     *
     * @return
     * A handle object that can be used to unsubscribe from updates.
     */
    exports.observeLocale = function (callback) {
        return localeProducer.on('change', function (event) {
            callback(event.target);
        });
    };
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
    function setLocaleMessages(bundle, localeMessages, locale) {
        var messages = tslib_1.__assign({}, bundle.messages, localeMessages);
        loadMessages(getBundleId(bundle), Object.freeze(messages), locale);
    }
    exports.setLocaleMessages = setLocaleMessages;
    /**
     * Change the root locale, and notify any registered observers.
     *
     * @param locale
     * The new locale.
     */
    function switchLocale(locale) {
        var previous = rootLocale;
        rootLocale = locale ? main_1.normalizeLocale(locale) : '';
        if (previous !== rootLocale) {
            if (load_1.isLoaded('supplemental', 'likelySubtags')) {
                Globalize.load({
                    main: (_a = {},
                        _a[rootLocale] = {},
                        _a)
                });
                Globalize.locale(rootLocale);
            }
            localeProducer.emit({ type: 'change', target: rootLocale });
        }
        var _a;
    }
    exports.switchLocale = switchLocale;
    /**
     * The default environment locale.
     *
     * It should be noted that while the system locale will be normalized to a single
     * format when loading message bundles, this value represents the unaltered
     * locale returned directly by the environment.
     */
    exports.systemLocale = (function () {
        var systemLocale = 'en';
        if (has_1.default('host-browser')) {
            var navigator_1 = global_1.default.navigator;
            systemLocale = navigator_1.language || navigator_1.userLanguage;
        }
        else if (has_1.default('host-node')) {
            systemLocale = process.env.LANG || systemLocale;
        }
        return main_1.normalizeLocale(systemLocale);
    })();
});
//# sourceMappingURL=i18n.js.map