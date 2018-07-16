(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/Symbol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Symbol_1 = require("../shim/Symbol");
    /**
     * The symbol identifier for a WNode type
     */
    exports.WNODE = Symbol_1.default('Identifier for a WNode.');
    /**
     * The symbol identifier for a VNode type
     */
    exports.VNODE = Symbol_1.default('Identifier for a VNode.');
    /**
     * The symbol identifier for a VNode type created using dom()
     */
    exports.DOMVNODE = Symbol_1.default('Identifier for a VNode created using existing dom.');
    /**
     * Helper function that returns true if the `DNode` is a `WNode` using the `type` property
     */
    function isWNode(child) {
        return Boolean(child && typeof child !== 'string' && child.type === exports.WNODE);
    }
    exports.isWNode = isWNode;
    /**
     * Helper function that returns true if the `DNode` is a `VNode` using the `type` property
     */
    function isVNode(child) {
        return Boolean(child && typeof child !== 'string' && (child.type === exports.VNODE || child.type === exports.DOMVNODE));
    }
    exports.isVNode = isVNode;
    /**
     * Helper function that returns true if the `DNode` is a `VNode` created with `dom()` using the `type` property
     */
    function isDomVNode(child) {
        return Boolean(child && typeof child !== 'string' && child.type === exports.DOMVNODE);
    }
    exports.isDomVNode = isDomVNode;
    function isElementNode(value) {
        return !!value.tagName;
    }
    exports.isElementNode = isElementNode;
    function decorate(dNodes, optionsOrModifier, predicate) {
        var shallow = false;
        var modifier;
        if (typeof optionsOrModifier === 'function') {
            modifier = optionsOrModifier;
        }
        else {
            modifier = optionsOrModifier.modifier;
            predicate = optionsOrModifier.predicate;
            shallow = optionsOrModifier.shallow || false;
        }
        var nodes = Array.isArray(dNodes) ? tslib_1.__spread(dNodes) : [dNodes];
        function breaker() {
            nodes = [];
        }
        while (nodes.length) {
            var node = nodes.shift();
            if (node) {
                if (!shallow && (isWNode(node) || isVNode(node)) && node.children) {
                    nodes = tslib_1.__spread(nodes, node.children);
                }
                if (!predicate || predicate(node)) {
                    modifier(node, breaker);
                }
            }
        }
        return dNodes;
    }
    exports.decorate = decorate;
    /**
     * Wrapper function for calls to create a widget.
     */
    function w(widgetConstructor, properties, children) {
        if (children === void 0) { children = []; }
        return {
            children: children,
            widgetConstructor: widgetConstructor,
            properties: properties,
            type: exports.WNODE
        };
    }
    exports.w = w;
    function v(tag, propertiesOrChildren, children) {
        if (propertiesOrChildren === void 0) { propertiesOrChildren = {}; }
        if (children === void 0) { children = undefined; }
        var properties = propertiesOrChildren;
        var deferredPropertiesCallback;
        if (Array.isArray(propertiesOrChildren)) {
            children = propertiesOrChildren;
            properties = {};
        }
        if (typeof properties === 'function') {
            deferredPropertiesCallback = properties;
            properties = {};
        }
        return {
            tag: tag,
            deferredPropertiesCallback: deferredPropertiesCallback,
            children: children,
            properties: properties,
            type: exports.VNODE
        };
    }
    exports.v = v;
    /**
     * Create a VNode for an existing DOM Node.
     */
    function dom(_a, children) {
        var node = _a.node, _b = _a.attrs, attrs = _b === void 0 ? {} : _b, _c = _a.props, props = _c === void 0 ? {} : _c, _d = _a.on, on = _d === void 0 ? {} : _d, _e = _a.diffType, diffType = _e === void 0 ? 'none' : _e;
        return {
            tag: isElementNode(node) ? node.tagName.toLowerCase() : '',
            properties: props,
            attributes: attrs,
            events: on,
            children: children,
            type: exports.DOMVNODE,
            domNode: node,
            text: isElementNode(node) ? undefined : node.data,
            diffType: diffType
        };
    }
    exports.dom = dom;
});
//# sourceMappingURL=d.js.map