(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./WidgetBase", "./mixins/Projector", "../shim/array", "./d", "../shim/global", "./mixins/Themed", "./decorators/alwaysRender"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var WidgetBase_1 = require("./WidgetBase");
    var Projector_1 = require("./mixins/Projector");
    var array_1 = require("../shim/array");
    var d_1 = require("./d");
    var global_1 = require("../shim/global");
    var Themed_1 = require("./mixins/Themed");
    var alwaysRender_1 = require("./decorators/alwaysRender");
    var CustomElementChildType;
    (function (CustomElementChildType) {
        CustomElementChildType["DOJO"] = "DOJO";
        CustomElementChildType["NODE"] = "NODE";
        CustomElementChildType["TEXT"] = "TEXT";
    })(CustomElementChildType = exports.CustomElementChildType || (exports.CustomElementChildType = {}));
    function DomToWidgetWrapper(domNode) {
        var DomToWidgetWrapper = /** @class */ (function (_super) {
            tslib_1.__extends(DomToWidgetWrapper, _super);
            function DomToWidgetWrapper() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            DomToWidgetWrapper.prototype.render = function () {
                var _this = this;
                var properties = Object.keys(this.properties).reduce(function (props, key) {
                    var value = _this.properties[key];
                    if (key.indexOf('on') === 0) {
                        key = "__" + key;
                    }
                    props[key] = value;
                    return props;
                }, {});
                return d_1.dom({ node: domNode, props: properties, diffType: 'dom' });
            };
            Object.defineProperty(DomToWidgetWrapper, "domNode", {
                get: function () {
                    return domNode;
                },
                enumerable: true,
                configurable: true
            });
            DomToWidgetWrapper = tslib_1.__decorate([
                alwaysRender_1.alwaysRender()
            ], DomToWidgetWrapper);
            return DomToWidgetWrapper;
        }(WidgetBase_1.WidgetBase));
        return DomToWidgetWrapper;
    }
    exports.DomToWidgetWrapper = DomToWidgetWrapper;
    function create(descriptor, WidgetConstructor) {
        var attributes = descriptor.attributes, childType = descriptor.childType, registryFactory = descriptor.registryFactory;
        var attributeMap = {};
        attributes.forEach(function (propertyName) {
            var attributeName = propertyName.toLowerCase();
            attributeMap[attributeName] = propertyName;
        });
        return /** @class */ (function (_super) {
            tslib_1.__extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._properties = {};
                _this._children = [];
                _this._eventProperties = {};
                _this._initialised = false;
                return _this;
            }
            class_1.prototype.connectedCallback = function () {
                var _this = this;
                if (this._initialised) {
                    return;
                }
                var domProperties = {};
                var attributes = descriptor.attributes, properties = descriptor.properties, events = descriptor.events;
                this._properties = tslib_1.__assign({}, this._properties, this._attributesToProperties(attributes));
                tslib_1.__spread(attributes, properties).forEach(function (propertyName) {
                    var value = _this[propertyName];
                    var filteredPropertyName = propertyName.replace(/^on/, '__');
                    if (value !== undefined) {
                        _this._properties[propertyName] = value;
                    }
                    if (filteredPropertyName !== propertyName) {
                        domProperties[filteredPropertyName] = {
                            get: function () { return _this._getProperty(propertyName); },
                            set: function (value) { return _this._setProperty(propertyName, value); }
                        };
                    }
                    domProperties[propertyName] = {
                        get: function () { return _this._getProperty(propertyName); },
                        set: function (value) { return _this._setProperty(propertyName, value); }
                    };
                });
                events.forEach(function (propertyName) {
                    var eventName = propertyName.replace(/^on/, '').toLowerCase();
                    var filteredPropertyName = propertyName.replace(/^on/, '__on');
                    domProperties[filteredPropertyName] = {
                        get: function () { return _this._getEventProperty(propertyName); },
                        set: function (value) { return _this._setEventProperty(propertyName, value); }
                    };
                    _this._eventProperties[propertyName] = undefined;
                    _this._properties[propertyName] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var eventCallback = _this._getEventProperty(propertyName);
                        if (typeof eventCallback === 'function') {
                            eventCallback.apply(void 0, tslib_1.__spread(args));
                        }
                        _this.dispatchEvent(new CustomEvent(eventName, {
                            bubbles: false,
                            detail: args
                        }));
                    };
                });
                Object.defineProperties(this, domProperties);
                var children = childType === CustomElementChildType.TEXT ? this.childNodes : this.children;
                array_1.from(children).forEach(function (childNode) {
                    if (childType === CustomElementChildType.DOJO) {
                        childNode.addEventListener('dojo-ce-render', function () { return _this._render(); });
                        childNode.addEventListener('dojo-ce-connected', function () { return _this._render(); });
                        _this._children.push(DomToWidgetWrapper(childNode));
                    }
                    else {
                        _this._children.push(d_1.dom({ node: childNode, diffType: 'dom' }));
                    }
                });
                this.addEventListener('dojo-ce-connected', function (e) { return _this._childConnected(e); });
                var widgetProperties = this._properties;
                var renderChildren = function () { return _this.__children__(); };
                var Wrapper = /** @class */ (function (_super) {
                    tslib_1.__extends(class_2, _super);
                    function class_2() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    class_2.prototype.render = function () {
                        return d_1.w(WidgetConstructor, widgetProperties, renderChildren());
                    };
                    return class_2;
                }(WidgetBase_1.WidgetBase));
                var registry = registryFactory();
                var themeContext = Themed_1.registerThemeInjector(this._getTheme(), registry);
                global_1.default.addEventListener('dojo-theme-set', function () { return themeContext.set(_this._getTheme()); });
                var Projector = Projector_1.ProjectorMixin(Wrapper);
                this._projector = new Projector();
                this._projector.setProperties({ registry: registry });
                this._projector.append(this);
                this._initialised = true;
                this.dispatchEvent(new CustomEvent('dojo-ce-connected', {
                    bubbles: true,
                    detail: this
                }));
            };
            class_1.prototype._getTheme = function () {
                if (global_1.default && global_1.default.dojoce && global_1.default.dojoce.theme) {
                    return global_1.default.dojoce.themes[global_1.default.dojoce.theme];
                }
            };
            class_1.prototype._childConnected = function (e) {
                var _this = this;
                var node = e.detail;
                if (node.parentNode === this) {
                    var exists = this._children.some(function (child) { return child.domNode === node; });
                    if (!exists) {
                        node.addEventListener('dojo-ce-render', function () { return _this._render(); });
                        this._children.push(DomToWidgetWrapper(node));
                        this._render();
                    }
                }
            };
            class_1.prototype._render = function () {
                if (this._projector) {
                    this._projector.invalidate();
                    this.dispatchEvent(new CustomEvent('dojo-ce-render', {
                        bubbles: false,
                        detail: this
                    }));
                }
            };
            class_1.prototype.__properties__ = function () {
                return tslib_1.__assign({}, this._properties, this._eventProperties);
            };
            class_1.prototype.__children__ = function () {
                if (childType === CustomElementChildType.DOJO) {
                    return this._children.filter(function (Child) { return Child.domNode.isWidget; }).map(function (Child) {
                        var domNode = Child.domNode;
                        return d_1.w(Child, tslib_1.__assign({}, domNode.__properties__()), tslib_1.__spread(domNode.__children__()));
                    });
                }
                else {
                    return this._children;
                }
            };
            class_1.prototype.attributeChangedCallback = function (name, oldValue, value) {
                var propertyName = attributeMap[name];
                this._setProperty(propertyName, value);
            };
            class_1.prototype._setEventProperty = function (propertyName, value) {
                this._eventProperties[propertyName] = value;
            };
            class_1.prototype._getEventProperty = function (propertyName) {
                return this._eventProperties[propertyName];
            };
            class_1.prototype._setProperty = function (propertyName, value) {
                if (typeof value === 'function') {
                    value[WidgetBase_1.noBind] = true;
                }
                this._properties[propertyName] = value;
                this._render();
            };
            class_1.prototype._getProperty = function (propertyName) {
                return this._properties[propertyName];
            };
            class_1.prototype._attributesToProperties = function (attributes) {
                var _this = this;
                return attributes.reduce(function (properties, propertyName) {
                    var attributeName = propertyName.toLowerCase();
                    var value = _this.getAttribute(attributeName);
                    if (value !== null) {
                        properties[propertyName] = value;
                    }
                    return properties;
                }, {});
            };
            Object.defineProperty(class_1, "observedAttributes", {
                get: function () {
                    return Object.keys(attributeMap);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(class_1.prototype, "isWidget", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            return class_1;
        }(HTMLElement));
    }
    exports.create = create;
    function register(WidgetConstructor) {
        var descriptor = WidgetConstructor.prototype && WidgetConstructor.prototype.__customElementDescriptor;
        if (!descriptor) {
            throw new Error('Cannot get descriptor for Custom Element, have you added the @customElement decorator to your Widget?');
        }
        global_1.default.customElements.define(descriptor.tagName, create(descriptor, WidgetConstructor));
    }
    exports.register = register;
    exports.default = register;
});
//# sourceMappingURL=registerCustomElement.js.map