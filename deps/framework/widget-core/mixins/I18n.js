(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../i18n/i18n", "../../shim/Map", "./../d", "./../decorators/afterRender", "./../decorators/inject", "./../Injector"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /* tslint:disable:interface-name */
    var i18n_1 = require("../../i18n/i18n");
    var Map_1 = require("../../shim/Map");
    var d_1 = require("./../d");
    var afterRender_1 = require("./../decorators/afterRender");
    var inject_1 = require("./../decorators/inject");
    var Injector_1 = require("./../Injector");
    exports.INJECTOR_KEY = Symbol('i18n');
    function registerI18nInjector(localeData, registry) {
        var injector = new Injector_1.Injector(localeData);
        registry.defineInjector(exports.INJECTOR_KEY, function (invalidator) {
            injector.setInvalidator(invalidator);
            return function () { return injector.get(); };
        });
        return injector;
    }
    exports.registerI18nInjector = registerI18nInjector;
    function I18nMixin(Base) {
        var I18n = /** @class */ (function (_super) {
            tslib_1.__extends(I18n, _super);
            function I18n() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
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
            I18n.prototype.localizeBundle = function (baseBundle, useDefaults) {
                if (useDefaults === void 0) { useDefaults = false; }
                var bundle = this._resolveBundle(baseBundle);
                var messages = this._getLocaleMessages(bundle);
                var isPlaceholder = !messages;
                var locale = this.properties.locale;
                var format = isPlaceholder && !useDefaults
                    ? function (key, options) { return ''; }
                    : function (key, options) { return i18n_1.formatMessage(bundle, key, options, locale); };
                return Object.create({
                    format: format,
                    isPlaceholder: isPlaceholder,
                    messages: messages || (useDefaults ? bundle.messages : this._getBlankMessages(bundle))
                });
            };
            I18n.prototype.renderDecorator = function (result) {
                var _this = this;
                d_1.decorate(result, {
                    modifier: function (node, breaker) {
                        var _a = _this.properties, locale = _a.locale, rtl = _a.rtl;
                        var properties = {};
                        if (typeof rtl === 'boolean') {
                            properties['dir'] = rtl ? 'rtl' : 'ltr';
                        }
                        if (locale) {
                            properties['lang'] = locale;
                        }
                        node.properties = tslib_1.__assign({}, node.properties, properties);
                        breaker();
                    },
                    predicate: d_1.isVNode
                });
                return result;
            };
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
            I18n.prototype._getBlankMessages = function (bundle) {
                var blank = {};
                return Object.keys(bundle.messages).reduce(function (blank, key) {
                    blank[key] = '';
                    return blank;
                }, blank);
            };
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
            I18n.prototype._getLocaleMessages = function (bundle) {
                var _this = this;
                var properties = this.properties;
                var locale = properties.locale || i18n_1.default.locale;
                var localeMessages = i18n_1.getCachedMessages(bundle, locale);
                if (localeMessages) {
                    return localeMessages;
                }
                i18n_1.default(bundle, locale).then(function () {
                    _this.invalidate();
                });
            };
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
            I18n.prototype._resolveBundle = function (bundle) {
                var i18nBundle = this.properties.i18nBundle;
                if (i18nBundle) {
                    if (i18nBundle instanceof Map_1.default) {
                        i18nBundle = i18nBundle.get(bundle);
                        if (!i18nBundle) {
                            return bundle;
                        }
                    }
                    return i18nBundle;
                }
                return bundle;
            };
            tslib_1.__decorate([
                afterRender_1.afterRender()
            ], I18n.prototype, "renderDecorator", null);
            I18n = tslib_1.__decorate([
                inject_1.inject({
                    name: exports.INJECTOR_KEY,
                    getProperties: function (localeData, properties) {
                        var _a = properties.locale, locale = _a === void 0 ? localeData.locale : _a, _b = properties.rtl, rtl = _b === void 0 ? localeData.rtl : _b;
                        return { locale: locale, rtl: rtl };
                    }
                })
            ], I18n);
            return I18n;
        }(Base));
        return I18n;
    }
    exports.I18nMixin = I18nMixin;
    exports.default = I18nMixin;
});
//# sourceMappingURL=I18n.js.map