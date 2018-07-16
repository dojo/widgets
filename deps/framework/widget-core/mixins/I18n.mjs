import * as tslib_1 from "tslib";
/* tslint:disable:interface-name */
import i18n, { formatMessage, getCachedMessages } from '../../i18n/i18n';
import Map from '../../shim/Map';
import { isVNode, decorate } from './../d';
import { afterRender } from './../decorators/afterRender';
import { inject } from './../decorators/inject';
import { Injector } from './../Injector';
export const INJECTOR_KEY = Symbol('i18n');
export function registerI18nInjector(localeData, registry) {
    const injector = new Injector(localeData);
    registry.defineInjector(INJECTOR_KEY, (invalidator) => {
        injector.setInvalidator(invalidator);
        return () => injector.get();
    });
    return injector;
}
export function I18nMixin(Base) {
    let I18n = class I18n extends Base {
        /**
         * Return a localized messages object for the provided bundle, deferring to the `i18nBundle` property
         * when present. If the localized messages have not yet been loaded, return either a blank bundle or the
         * default messages.
         *
         * @param bundle
         * The bundle to localize
         *
         * @param useDefaults
         * If `true`, the default messages will be used when the localized messages have not yet been loaded. If `false`
         * (the default), then a blank bundle will be returned (i.e., each key's value will be an empty string).
         */
        localizeBundle(baseBundle, useDefaults = false) {
            const bundle = this._resolveBundle(baseBundle);
            const messages = this._getLocaleMessages(bundle);
            const isPlaceholder = !messages;
            const { locale } = this.properties;
            const format = isPlaceholder && !useDefaults
                ? (key, options) => ''
                : (key, options) => formatMessage(bundle, key, options, locale);
            return Object.create({
                format,
                isPlaceholder,
                messages: messages || (useDefaults ? bundle.messages : this._getBlankMessages(bundle))
            });
        }
        renderDecorator(result) {
            decorate(result, {
                modifier: (node, breaker) => {
                    const { locale, rtl } = this.properties;
                    const properties = {};
                    if (typeof rtl === 'boolean') {
                        properties['dir'] = rtl ? 'rtl' : 'ltr';
                    }
                    if (locale) {
                        properties['lang'] = locale;
                    }
                    node.properties = Object.assign({}, node.properties, properties);
                    breaker();
                },
                predicate: isVNode
            });
            return result;
        }
        /**
         * @private
         * Return a message bundle containing an empty string for each key in the provided bundle.
         *
         * @param bundle
         * The message bundle
         *
         * @return
         * The blank message bundle
         */
        _getBlankMessages(bundle) {
            const blank = {};
            return Object.keys(bundle.messages).reduce((blank, key) => {
                blank[key] = '';
                return blank;
            }, blank);
        }
        /**
         * @private
         * Return the cached dictionary for the specified bundle and locale, if it exists. If the requested dictionary does not
         * exist, then load it and update the instance's state with the appropriate messages.
         *
         * @param bundle
         * The bundle for which to load a locale-specific dictionary.
         *
         * @return
         * The locale-specific dictionary, if it has already been loaded and cached.
         */
        _getLocaleMessages(bundle) {
            const { properties } = this;
            const locale = properties.locale || i18n.locale;
            const localeMessages = getCachedMessages(bundle, locale);
            if (localeMessages) {
                return localeMessages;
            }
            i18n(bundle, locale).then(() => {
                this.invalidate();
            });
        }
        /**
         * @private
         * Resolve the bundle to use for the widget's messages to either the provided bundle or to the
         * `i18nBundle` property.
         *
         * @param bundle
         * The base bundle
         *
         * @return
         * Either override bundle or the original bundle.
         */
        _resolveBundle(bundle) {
            let { i18nBundle } = this.properties;
            if (i18nBundle) {
                if (i18nBundle instanceof Map) {
                    i18nBundle = i18nBundle.get(bundle);
                    if (!i18nBundle) {
                        return bundle;
                    }
                }
                return i18nBundle;
            }
            return bundle;
        }
    };
    tslib_1.__decorate([
        afterRender()
    ], I18n.prototype, "renderDecorator", null);
    I18n = tslib_1.__decorate([
        inject({
            name: INJECTOR_KEY,
            getProperties: (localeData, properties) => {
                const { locale = localeData.locale, rtl = localeData.rtl } = properties;
                return { locale, rtl };
            }
        })
    ], I18n);
    return I18n;
}
export default I18nMixin;
//# sourceMappingURL=I18n.mjs.map