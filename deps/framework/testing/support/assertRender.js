(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../widget-core/d", "diff", "../../shim/WeakMap", "../../shim/Set", "../../shim/Map", "../../shim/array"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var d_1 = require("../../widget-core/d");
    var diff = require("diff");
    var WeakMap_1 = require("../../shim/WeakMap");
    var Set_1 = require("../../shim/Set");
    var Map_1 = require("../../shim/Map");
    var array_1 = require("../../shim/array");
    var widgetClassCounter = 0;
    var widgetMap = new WeakMap_1.default();
    function replacer(key, value) {
        if (typeof value === 'function') {
            return 'function';
        }
        else if (typeof value === 'undefined') {
            return 'undefined';
        }
        else if (value instanceof Set_1.default || value instanceof Map_1.default) {
            return array_1.from(value);
        }
        return value;
    }
    function formatDNodes(nodes, depth) {
        if (depth === void 0) { depth = 0; }
        var isArrayFragment = Array.isArray(nodes) && depth === 0;
        var initial = isArrayFragment ? '[\n' : '';
        var tabs = '';
        depth = isArrayFragment ? 1 : depth;
        nodes = Array.isArray(nodes) ? nodes : [nodes];
        for (var i = 0; i < depth; i++) {
            tabs = tabs + "\t";
        }
        var formattedNode = nodes.reduce(function (result, node, index) {
            if (node === null || node === undefined) {
                return result;
            }
            if (index > 0) {
                result = result + "\n";
            }
            result = "" + result + tabs;
            if (typeof node === 'string') {
                return result + "\"" + node + "\"";
            }
            result = "" + result + formatNode(node, tabs);
            if (node.children && node.children.length > 0) {
                result = result + ", [\n" + formatDNodes(node.children, depth + 1) + "\n" + tabs + "]";
            }
            return result + ")";
        }, initial);
        return isArrayFragment ? (formattedNode = formattedNode + "\n]") : formattedNode;
    }
    exports.formatDNodes = formatDNodes;
    function formatProperties(properties, tabs) {
        properties = Object.keys(properties)
            .sort()
            .reduce(function (props, key) {
            props[key] = properties[key];
            return props;
        }, {});
        properties = JSON.stringify(properties, replacer, tabs + "\t").slice(0, -1);
        return "" + properties + tabs + "}";
    }
    function getWidgetName(widgetConstructor) {
        var name;
        if (typeof widgetConstructor === 'string' || typeof widgetConstructor === 'symbol') {
            name = widgetConstructor.toString();
        }
        else {
            name = widgetConstructor.name;
            if (name === undefined) {
                var id = widgetMap.get(widgetConstructor);
                if (id === undefined) {
                    id = ++widgetClassCounter;
                    widgetMap.set(widgetConstructor, id);
                }
                name = "Widget-" + id;
            }
        }
        return name;
    }
    function formatNode(node, tabs) {
        var propertyKeyCount = Object.keys(node.properties).length;
        var properties = propertyKeyCount > 0 ? formatProperties(node.properties, tabs) : '{}';
        if (d_1.isWNode(node)) {
            return "w(" + getWidgetName(node.widgetConstructor) + ", " + properties;
        }
        return "v(\"" + node.tag + "\", " + properties;
    }
    function assertRender(actual, expected, message) {
        var parsedActual = formatDNodes(actual);
        var parsedExpected = formatDNodes(expected);
        var diffResult = diff.diffLines(parsedActual, parsedExpected);
        var diffFound = false;
        var parsedDiff = diffResult.reduce(function (result, part, index) {
            if (part.added) {
                diffFound = true;
                result = result + "(E)" + part.value.replace(/\n\t/g, '\n(E)\t');
            }
            else if (part.removed) {
                diffFound = true;
                result = result + "(A)" + part.value.replace(/\n\t/g, '\n(A)\t');
            }
            else {
                result = "" + result + part.value;
            }
            return result;
        }, '\n');
        if (diffFound) {
            throw new Error(parsedDiff);
        }
    }
    exports.assertRender = assertRender;
    exports.default = assertRender;
});
//# sourceMappingURL=assertRender.js.map