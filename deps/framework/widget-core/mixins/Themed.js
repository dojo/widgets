(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./../Injector", "./../decorators/inject", "./../decorators/handleDecorator", "./../decorators/diffProperty", "./../diff"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Injector_1 = require("./../Injector");
    var inject_1 = require("./../decorators/inject");
    var handleDecorator_1 = require("./../decorators/handleDecorator");
    var diffProperty_1 = require("./../decorators/diffProperty");
    var diff_1 = require("./../diff");
    var THEME_KEY = ' _key';
    exports.INJECTED_THEME_KEY = Symbol('theme');
    /**
     * Decorator for base css classes
     */
    function theme(theme) {
        return handleDecorator_1.handleDecorator(function (target) {
            target.addDecorator('baseThemeClasses', theme);
        });
    }
    exports.theme = theme;
    /**
     * Creates a reverse lookup for the classes passed in via the `theme` function.
     *
     * @param classes The baseClasses object
     * @requires
     */
    function createThemeClassesLookup(classes) {
        return classes.reduce(function (currentClassNames, baseClass) {
            Object.keys(baseClass).forEach(function (key) {
                currentClassNames[baseClass[key]] = key;
            });
            return currentClassNames;
        }, {});
    }
    /**
     * Convenience function that is given a theme and an optional registry, the theme
     * injector is defined against the registry, returning the theme.
     *
     * @param theme the theme to set
     * @param themeRegistry registry to define the theme injector against. Defaults
     * to the global registry
     *
     * @returns the theme injector used to set the theme
     */
    function registerThemeInjector(theme, themeRegistry) {
        var themeInjector = new Injector_1.Injector(theme);
        themeRegistry.defineInjector(exports.INJECTED_THEME_KEY, function (invalidator) {
            themeInjector.setInvalidator(invalidator);
            return function () { return themeInjector.get(); };
        });
        return themeInjector;
    }
    exports.registerThemeInjector = registerThemeInjector;
    /**
     * Function that returns a class decorated with with Themed functionality
     */
    function ThemedMixin(Base) {
        var Themed = /** @class */ (function (_super) {
            tslib_1.__extends(Themed, _super);
            function Themed() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * Registered base theme keys
                 */
                _this._registeredBaseThemeKeys = [];
                /**
                 * Indicates if classes meta data need to be calculated.
                 */
                _this._recalculateClasses = true;
                /**
                 * Loaded theme
                 */
                _this._theme = {};
                return _this;
            }
            Themed.prototype.theme = function (classes) {
                var _this = this;
                if (this._recalculateClasses) {
                    this._recalculateThemeClasses();
                }
                if (Array.isArray(classes)) {
                    return classes.map(function (className) { return _this._getThemeClass(className); });
                }
                return this._getThemeClass(classes);
            };
            /**
             * Function fired when `theme` or `extraClasses` are changed.
             */
            Themed.prototype.onPropertiesChanged = function () {
                this._recalculateClasses = true;
            };
            Themed.prototype._getThemeClass = function (className) {
                if (className === undefined || className === null) {
                    return className;
                }
                var extraClasses = this.properties.extraClasses || {};
                var themeClassName = this._baseThemeClassesReverseLookup[className];
                var resultClassNames = [];
                if (!themeClassName) {
                    console.warn("Class name: '" + className + "' not found in theme");
                    return null;
                }
                if (extraClasses[themeClassName]) {
                    resultClassNames.push(extraClasses[themeClassName]);
                }
                if (this._theme[themeClassName]) {
                    resultClassNames.push(this._theme[themeClassName]);
                }
                else {
                    resultClassNames.push(this._registeredBaseTheme[themeClassName]);
                }
                return resultClassNames.join(' ');
            };
            Themed.prototype._recalculateThemeClasses = function () {
                var _this = this;
                var _a = this.properties.theme, theme = _a === void 0 ? {} : _a;
                var baseThemes = this.getDecorator('baseThemeClasses');
                if (!this._registeredBaseTheme) {
                    this._registeredBaseTheme = baseThemes.reduce(function (finalBaseTheme, baseTheme) {
                        var _a = THEME_KEY, key = baseTheme[_a], classes = tslib_1.__rest(baseTheme, [typeof _a === "symbol" ? _a : _a + ""]);
                        _this._registeredBaseThemeKeys.push(key);
                        return tslib_1.__assign({}, finalBaseTheme, classes);
                    }, {});
                    this._baseThemeClassesReverseLookup = createThemeClassesLookup(baseThemes);
                }
                this._theme = this._registeredBaseThemeKeys.reduce(function (baseTheme, themeKey) {
                    return tslib_1.__assign({}, baseTheme, theme[themeKey]);
                }, {});
                this._recalculateClasses = false;
            };
            tslib_1.__decorate([
                diffProperty_1.diffProperty('theme', diff_1.shallow),
                diffProperty_1.diffProperty('extraClasses', diff_1.shallow)
            ], Themed.prototype, "onPropertiesChanged", null);
            Themed = tslib_1.__decorate([
                inject_1.inject({
                    name: exports.INJECTED_THEME_KEY,
                    getProperties: function (theme, properties) {
                        if (!properties.theme) {
                            return { theme: theme };
                        }
                        return {};
                    }
                })
            ], Themed);
            return Themed;
        }(Base));
        return Themed;
    }
    exports.ThemedMixin = ThemedMixin;
    exports.default = ThemedMixin;
});
//# sourceMappingURL=Themed.js.map