(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./support/assertRender", "./support/selector", "../widget-core/d"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var assertRender_1 = require("./support/assertRender");
    var selector_1 = require("./support/selector");
    var d_1 = require("../widget-core/d");
    function decorateNodes(dNode) {
        var hasDeferredProperties = false;
        function addParent(parent) {
            (parent.children || []).forEach(function (child) {
                if (d_1.isVNode(child) || d_1.isWNode(child)) {
                    child.parent = parent;
                }
            });
            if (d_1.isVNode(parent) && typeof parent.deferredPropertiesCallback === 'function') {
                hasDeferredProperties = true;
                parent.properties = tslib_1.__assign({}, parent.properties, parent.deferredPropertiesCallback(false));
            }
        }
        var nodes = d_1.decorate(dNode, addParent, function (node) { return d_1.isWNode(node) || d_1.isVNode(node); });
        return { hasDeferredProperties: hasDeferredProperties, nodes: nodes };
    }
    function harness(renderFunc, customComparator) {
        if (customComparator === void 0) { customComparator = []; }
        var invalidated = true;
        var wNode = renderFunc();
        var widget;
        var renderStack = [];
        var properties = wNode.properties, children = wNode.children;
        var widgetConstructor = wNode.widgetConstructor;
        if (typeof widgetConstructor === 'function') {
            widget = new /** @class */ (function (_super) {
                tslib_1.__extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_1.prototype.invalidate = function () {
                    invalidated = true;
                    _super.prototype.invalidate.call(this);
                };
                return class_1;
            }(widgetConstructor))();
            widget.__setProperties__(properties);
            widget.__setChildren__(children);
            _tryRender();
        }
        else {
            throw new Error('Harness does not support registry items');
        }
        function _getRender(count) {
            return count ? renderStack[count] : renderStack[renderStack.length - 1];
        }
        function _runCompares(nodes, isExpected) {
            if (isExpected === void 0) { isExpected = false; }
            customComparator.forEach(function (_a) {
                var selector = _a.selector, property = _a.property, comparator = _a.comparator;
                var items = selector_1.select(selector, nodes);
                items.forEach(function (item, index) {
                    var comparatorName = "comparator(selector=" + selector + ", " + property + ")";
                    if (item && item.properties && item.properties[property] !== undefined) {
                        var comparatorResult = comparator(item.properties[property])
                            ? comparatorName
                            : comparatorName + " FAILED";
                        item.properties[property] = isExpected ? comparatorName : comparatorResult;
                    }
                });
            });
        }
        function _tryRender() {
            var _a = renderFunc(), properties = _a.properties, children = _a.children;
            widget.__setProperties__(properties);
            widget.__setChildren__(children);
            if (invalidated) {
                var render = widget.__render__();
                var _b = decorateNodes(render), hasDeferredProperties = _b.hasDeferredProperties, nodes = _b.nodes;
                _runCompares(nodes);
                renderStack.push(nodes);
                if (hasDeferredProperties) {
                    var afterDeferredPropertiesNodes = decorateNodes(render).nodes;
                    _runCompares(afterDeferredPropertiesNodes);
                    renderStack.push(afterDeferredPropertiesNodes);
                }
                invalidated = false;
            }
        }
        function _expect(expectedRenderFunc, actualRenderFunc, selector) {
            var renderResult;
            if (actualRenderFunc === undefined) {
                _tryRender();
                renderResult = _getRender();
            }
            else {
                renderResult = actualRenderFunc();
            }
            var expectedRenderResult = decorateNodes(expectedRenderFunc()).nodes;
            _runCompares(expectedRenderResult, true);
            if (selector) {
                var _a = tslib_1.__read(selector_1.select(selector, renderResult), 1), firstItem = _a[0];
                assertRender_1.default(firstItem, expectedRenderResult);
            }
            else {
                assertRender_1.default(renderResult, expectedRenderResult);
            }
        }
        return {
            expect: function (expectedRenderFunc, actualRenderFunc) {
                return _expect(expectedRenderFunc, actualRenderFunc);
            },
            expectPartial: function (selector, expectedRenderFunc, actualRenderFunc) {
                return _expect(expectedRenderFunc, actualRenderFunc, selector);
            },
            trigger: function (selector, functionSelector) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                _tryRender();
                var _a = tslib_1.__read(selector_1.select(selector, _getRender()), 1), firstItem = _a[0];
                if (firstItem) {
                    var triggerFunction = void 0;
                    if (typeof functionSelector === 'string') {
                        triggerFunction = firstItem.properties[functionSelector];
                    }
                    else {
                        triggerFunction = functionSelector(firstItem);
                    }
                    if (triggerFunction) {
                        return triggerFunction.apply(widget, args);
                    }
                }
            },
            getRender: function (index) {
                return _getRender(index);
            }
        };
    }
    exports.harness = harness;
    exports.default = harness;
});
//# sourceMappingURL=harness.js.map