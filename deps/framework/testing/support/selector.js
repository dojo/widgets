(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../widget-core/d", "css-select-umd"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var d_1 = require("../../widget-core/d");
    var cssSelect = require("css-select-umd");
    exports.parseSelector = function (selector) {
        var selectors = selector.split(' ');
        return selectors
            .map(function (selector) {
            var keySigilIndex = selector.indexOf('@');
            if (keySigilIndex === 0) {
                return "[key=\"" + selector.substr(1) + "\"]";
            }
            else if (keySigilIndex > 0) {
                var key = selector.substring(keySigilIndex + 1);
                return selector.slice(0, keySigilIndex) + "[key=\"" + key + "\"]";
            }
            return selector;
        })
            .join(' ');
    };
    exports.adapter = {
        isTag: function (elem) {
            return d_1.isVNode(elem);
        },
        getText: function (elem) {
            return '';
        },
        removeSubsets: function (elements) {
            return elements;
        },
        getChildren: function (elem) {
            return d_1.isVNode(elem) || d_1.isWNode(elem) ? elem.children : [];
        },
        getAttributeValue: function (elem, name) {
            if (d_1.isVNode(elem) || d_1.isWNode(elem)) {
                if (name === 'class') {
                    var classes = elem.properties.classes;
                    if (Array.isArray(classes)) {
                        return classes.join(' ');
                    }
                    return classes;
                }
                return elem.properties[name];
            }
        },
        hasAttrib: function (elem, name) {
            if (d_1.isVNode(elem) || d_1.isWNode(elem)) {
                return name in elem.properties;
            }
            return false;
        },
        existsOne: function (test, elements) {
            return elements.some(function (elem) { return test(elem); });
        },
        getName: function (elem) {
            if (d_1.isVNode(elem)) {
                return elem.tag;
            }
        },
        getParent: function (elem) {
            if (d_1.isVNode(elem) || d_1.isWNode(elem)) {
                return elem.parent;
            }
        },
        getSiblings: function (elem) {
            if (d_1.isVNode(elem) || d_1.isWNode(elem)) {
                if (elem.parent) {
                    return elem.parent.children;
                }
                return [elem];
            }
        },
        findOne: function (test, arr) {
            var elem = null;
            for (var i = 0, l = arr.length; i < l && !elem; i++) {
                if (test(arr[i])) {
                    elem = arr[i];
                }
                else {
                    var children = exports.adapter.getChildren(arr[i]);
                    if (children && children.length > 0) {
                        elem = exports.adapter.findOne(test, children);
                    }
                }
            }
            return elem;
        },
        findAll: function (test, elements) {
            var result = [];
            for (var i = 0, j = elements.length; i < j; i++) {
                if (test(elements[i])) {
                    result.push(elements[i]);
                }
                var children = exports.adapter.getChildren(elements[i]);
                if (children) {
                    result = tslib_1.__spread(result, exports.adapter.findAll(test, children));
                }
            }
            return result;
        }
    };
    function select(selector, nodes) {
        nodes = Array.isArray(nodes) ? nodes : [nodes];
        selector = exports.parseSelector(selector);
        return cssSelect(selector, nodes, { adapter: exports.adapter });
    }
    exports.select = select;
    exports.default = select;
});
//# sourceMappingURL=selector.js.map