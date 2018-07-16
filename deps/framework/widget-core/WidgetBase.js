(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/Map", "../shim/WeakMap", "../shim/Symbol", "./d", "./diff", "./RegistryHandler", "./NodeHandler", "./vdom", "./Registry"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Map_1 = require("../shim/Map");
    var WeakMap_1 = require("../shim/WeakMap");
    var Symbol_1 = require("../shim/Symbol");
    var d_1 = require("./d");
    var diff_1 = require("./diff");
    var RegistryHandler_1 = require("./RegistryHandler");
    var NodeHandler_1 = require("./NodeHandler");
    var vdom_1 = require("./vdom");
    var Registry_1 = require("./Registry");
    var decoratorMap = new Map_1.default();
    var boundAuto = diff_1.auto.bind(null);
    exports.noBind = Symbol_1.default.for('dojoNoBind');
    /**
     * Main widget base for all widgets to extend
     */
    var WidgetBase = /** @class */ (function () {
        /**
         * @constructor
         */
        function WidgetBase() {
            var _this = this;
            /**
             * Indicates if it is the initial set properties cycle
             */
            this._initialProperties = true;
            /**
             * Array of property keys considered changed from the previous set properties
             */
            this._changedPropertyKeys = [];
            this._nodeHandler = new NodeHandler_1.default();
            this._handles = [];
            this._children = [];
            this._decoratorCache = new Map_1.default();
            this._properties = {};
            this._boundRenderFunc = this.render.bind(this);
            this._boundInvalidate = this.invalidate.bind(this);
            vdom_1.widgetInstanceMap.set(this, {
                dirty: true,
                onAttach: function () {
                    _this.onAttach();
                },
                onDetach: function () {
                    _this.onDetach();
                    _this.destroy();
                },
                nodeHandler: this._nodeHandler,
                registry: function () {
                    return _this.registry;
                },
                coreProperties: {},
                rendering: false,
                inputProperties: {}
            });
            this._runAfterConstructors();
        }
        WidgetBase.prototype.meta = function (MetaType) {
            if (this._metaMap === undefined) {
                this._metaMap = new Map_1.default();
            }
            var cached = this._metaMap.get(MetaType);
            if (!cached) {
                cached = new MetaType({
                    invalidate: this._boundInvalidate,
                    nodeHandler: this._nodeHandler,
                    bind: this
                });
                this.own(cached);
                this._metaMap.set(MetaType, cached);
            }
            return cached;
        };
        WidgetBase.prototype.onAttach = function () {
            // Do nothing by default.
        };
        WidgetBase.prototype.onDetach = function () {
            // Do nothing by default.
        };
        Object.defineProperty(WidgetBase.prototype, "properties", {
            get: function () {
                return this._properties;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WidgetBase.prototype, "changedPropertyKeys", {
            get: function () {
                return tslib_1.__spread(this._changedPropertyKeys);
            },
            enumerable: true,
            configurable: true
        });
        WidgetBase.prototype.__setCoreProperties__ = function (coreProperties) {
            var baseRegistry = coreProperties.baseRegistry;
            var instanceData = vdom_1.widgetInstanceMap.get(this);
            if (instanceData.coreProperties.baseRegistry !== baseRegistry) {
                if (this._registry === undefined) {
                    this._registry = new RegistryHandler_1.default();
                    this.own(this._registry);
                    this.own(this._registry.on('invalidate', this._boundInvalidate));
                }
                this._registry.base = baseRegistry;
                this.invalidate();
            }
            instanceData.coreProperties = coreProperties;
        };
        WidgetBase.prototype.__setProperties__ = function (originalProperties) {
            var _this = this;
            var instanceData = vdom_1.widgetInstanceMap.get(this);
            instanceData.inputProperties = originalProperties;
            var properties = this._runBeforeProperties(originalProperties);
            var registeredDiffPropertyNames = this.getDecorator('registeredDiffProperty');
            var changedPropertyKeys = [];
            var propertyNames = Object.keys(properties);
            if (this._initialProperties === false || registeredDiffPropertyNames.length !== 0) {
                var allProperties = tslib_1.__spread(propertyNames, Object.keys(this._properties));
                var checkedProperties = [];
                var diffPropertyResults_1 = {};
                var runReactions = false;
                for (var i = 0; i < allProperties.length; i++) {
                    var propertyName = allProperties[i];
                    if (checkedProperties.indexOf(propertyName) !== -1) {
                        continue;
                    }
                    checkedProperties.push(propertyName);
                    var previousProperty = this._properties[propertyName];
                    var newProperty = this._bindFunctionProperty(properties[propertyName], instanceData.coreProperties.bind);
                    if (registeredDiffPropertyNames.indexOf(propertyName) !== -1) {
                        runReactions = true;
                        var diffFunctions = this.getDecorator("diffProperty:" + propertyName);
                        for (var i_1 = 0; i_1 < diffFunctions.length; i_1++) {
                            var result = diffFunctions[i_1](previousProperty, newProperty);
                            if (result.changed && changedPropertyKeys.indexOf(propertyName) === -1) {
                                changedPropertyKeys.push(propertyName);
                            }
                            if (propertyName in properties) {
                                diffPropertyResults_1[propertyName] = result.value;
                            }
                        }
                    }
                    else {
                        var result = boundAuto(previousProperty, newProperty);
                        if (result.changed && changedPropertyKeys.indexOf(propertyName) === -1) {
                            changedPropertyKeys.push(propertyName);
                        }
                        if (propertyName in properties) {
                            diffPropertyResults_1[propertyName] = result.value;
                        }
                    }
                }
                if (runReactions) {
                    var reactionFunctions = this.getDecorator('diffReaction');
                    var executedReactions_1 = [];
                    reactionFunctions.forEach(function (_a) {
                        var reaction = _a.reaction, propertyName = _a.propertyName;
                        var propertyChanged = changedPropertyKeys.indexOf(propertyName) !== -1;
                        var reactionRun = executedReactions_1.indexOf(reaction) !== -1;
                        if (propertyChanged && !reactionRun) {
                            reaction.call(_this, _this._properties, diffPropertyResults_1);
                            executedReactions_1.push(reaction);
                        }
                    });
                }
                this._properties = diffPropertyResults_1;
                this._changedPropertyKeys = changedPropertyKeys;
            }
            else {
                this._initialProperties = false;
                for (var i = 0; i < propertyNames.length; i++) {
                    var propertyName = propertyNames[i];
                    if (typeof properties[propertyName] === 'function') {
                        properties[propertyName] = this._bindFunctionProperty(properties[propertyName], instanceData.coreProperties.bind);
                    }
                    else {
                        changedPropertyKeys.push(propertyName);
                    }
                }
                this._changedPropertyKeys = changedPropertyKeys;
                this._properties = tslib_1.__assign({}, properties);
            }
            if (this._changedPropertyKeys.length > 0) {
                this.invalidate();
            }
        };
        Object.defineProperty(WidgetBase.prototype, "children", {
            get: function () {
                return this._children;
            },
            enumerable: true,
            configurable: true
        });
        WidgetBase.prototype.__setChildren__ = function (children) {
            if (this._children.length > 0 || children.length > 0) {
                this._children = children;
                this.invalidate();
            }
        };
        WidgetBase.prototype.__render__ = function () {
            var instanceData = vdom_1.widgetInstanceMap.get(this);
            instanceData.dirty = false;
            var render = this._runBeforeRenders();
            var dNode = render();
            dNode = this.runAfterRenders(dNode);
            this._nodeHandler.clear();
            return dNode;
        };
        WidgetBase.prototype.invalidate = function () {
            var instanceData = vdom_1.widgetInstanceMap.get(this);
            if (instanceData.invalidate) {
                instanceData.invalidate();
            }
        };
        WidgetBase.prototype.render = function () {
            return d_1.v('div', {}, this.children);
        };
        /**
         * Function to add decorators to WidgetBase
         *
         * @param decoratorKey The key of the decorator
         * @param value The value of the decorator
         */
        WidgetBase.prototype.addDecorator = function (decoratorKey, value) {
            value = Array.isArray(value) ? value : [value];
            if (this.hasOwnProperty('constructor')) {
                var decoratorList = decoratorMap.get(this.constructor);
                if (!decoratorList) {
                    decoratorList = new Map_1.default();
                    decoratorMap.set(this.constructor, decoratorList);
                }
                var specificDecoratorList = decoratorList.get(decoratorKey);
                if (!specificDecoratorList) {
                    specificDecoratorList = [];
                    decoratorList.set(decoratorKey, specificDecoratorList);
                }
                specificDecoratorList.push.apply(specificDecoratorList, tslib_1.__spread(value));
            }
            else {
                var decorators = this.getDecorator(decoratorKey);
                this._decoratorCache.set(decoratorKey, tslib_1.__spread(decorators, value));
            }
        };
        /**
         * Function to build the list of decorators from the global decorator map.
         *
         * @param decoratorKey  The key of the decorator
         * @return An array of decorator values
         * @private
         */
        WidgetBase.prototype._buildDecoratorList = function (decoratorKey) {
            var allDecorators = [];
            var constructor = this.constructor;
            while (constructor) {
                var instanceMap = decoratorMap.get(constructor);
                if (instanceMap) {
                    var decorators = instanceMap.get(decoratorKey);
                    if (decorators) {
                        allDecorators.unshift.apply(allDecorators, tslib_1.__spread(decorators));
                    }
                }
                constructor = Object.getPrototypeOf(constructor);
            }
            return allDecorators;
        };
        /**
         * Function to retrieve decorator values
         *
         * @param decoratorKey The key of the decorator
         * @returns An array of decorator values
         */
        WidgetBase.prototype.getDecorator = function (decoratorKey) {
            var allDecorators = this._decoratorCache.get(decoratorKey);
            if (allDecorators !== undefined) {
                return allDecorators;
            }
            allDecorators = this._buildDecoratorList(decoratorKey);
            this._decoratorCache.set(decoratorKey, allDecorators);
            return allDecorators;
        };
        /**
         * Binds unbound property functions to the specified `bind` property
         *
         * @param properties properties to check for functions
         */
        WidgetBase.prototype._bindFunctionProperty = function (property, bind) {
            if (typeof property === 'function' && !property[exports.noBind] && Registry_1.isWidgetBaseConstructor(property) === false) {
                if (this._bindFunctionPropertyMap === undefined) {
                    this._bindFunctionPropertyMap = new WeakMap_1.default();
                }
                var bindInfo = this._bindFunctionPropertyMap.get(property) || {};
                var boundFunc = bindInfo.boundFunc, scope = bindInfo.scope;
                if (boundFunc === undefined || scope !== bind) {
                    boundFunc = property.bind(bind);
                    this._bindFunctionPropertyMap.set(property, { boundFunc: boundFunc, scope: bind });
                }
                return boundFunc;
            }
            return property;
        };
        Object.defineProperty(WidgetBase.prototype, "registry", {
            get: function () {
                if (this._registry === undefined) {
                    this._registry = new RegistryHandler_1.default();
                    this.own(this._registry);
                    this.own(this._registry.on('invalidate', this._boundInvalidate));
                }
                return this._registry;
            },
            enumerable: true,
            configurable: true
        });
        WidgetBase.prototype._runBeforeProperties = function (properties) {
            var _this = this;
            var beforeProperties = this.getDecorator('beforeProperties');
            if (beforeProperties.length > 0) {
                return beforeProperties.reduce(function (properties, beforePropertiesFunction) {
                    return tslib_1.__assign({}, properties, beforePropertiesFunction.call(_this, properties));
                }, tslib_1.__assign({}, properties));
            }
            return properties;
        };
        /**
         * Run all registered before renders and return the updated render method
         */
        WidgetBase.prototype._runBeforeRenders = function () {
            var _this = this;
            var beforeRenders = this.getDecorator('beforeRender');
            if (beforeRenders.length > 0) {
                return beforeRenders.reduce(function (render, beforeRenderFunction) {
                    var updatedRender = beforeRenderFunction.call(_this, render, _this._properties, _this._children);
                    if (!updatedRender) {
                        console.warn('Render function not returned from beforeRender, using previous render');
                        return render;
                    }
                    return updatedRender;
                }, this._boundRenderFunc);
            }
            return this._boundRenderFunc;
        };
        /**
         * Run all registered after renders and return the decorated DNodes
         *
         * @param dNode The DNodes to run through the after renders
         */
        WidgetBase.prototype.runAfterRenders = function (dNode) {
            var _this = this;
            var afterRenders = this.getDecorator('afterRender');
            if (afterRenders.length > 0) {
                dNode = afterRenders.reduce(function (dNode, afterRenderFunction) {
                    return afterRenderFunction.call(_this, dNode);
                }, dNode);
            }
            if (this._metaMap !== undefined) {
                this._metaMap.forEach(function (meta) {
                    meta.afterRender();
                });
            }
            return dNode;
        };
        WidgetBase.prototype._runAfterConstructors = function () {
            var _this = this;
            var afterConstructors = this.getDecorator('afterConstructor');
            if (afterConstructors.length > 0) {
                afterConstructors.forEach(function (afterConstructor) { return afterConstructor.call(_this); });
            }
        };
        WidgetBase.prototype.own = function (handle) {
            this._handles.push(handle);
        };
        WidgetBase.prototype.destroy = function () {
            while (this._handles.length > 0) {
                var handle = this._handles.pop();
                if (handle) {
                    handle.destroy();
                }
            }
        };
        /**
         * static identifier
         */
        WidgetBase._type = Registry_1.WIDGET_BASE_TYPE;
        return WidgetBase;
    }());
    exports.WidgetBase = WidgetBase;
    exports.default = WidgetBase;
});
//# sourceMappingURL=WidgetBase.js.map