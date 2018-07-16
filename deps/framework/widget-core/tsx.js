(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./d"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var d_1 = require("./d");
    exports.REGISTRY_ITEM = Symbol('Identifier for an item from the Widget Registry.');
    var FromRegistry = /** @class */ (function () {
        function FromRegistry() {
            this.properties = {};
        }
        FromRegistry.type = exports.REGISTRY_ITEM;
        return FromRegistry;
    }());
    exports.FromRegistry = FromRegistry;
    function fromRegistry(tag) {
        return _a = /** @class */ (function (_super) {
                tslib_1.__extends(class_1, _super);
                function class_1() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.properties = {};
                    _this.name = tag;
                    return _this;
                }
                return class_1;
            }(FromRegistry)),
            _a.type = exports.REGISTRY_ITEM,
            _a;
        var _a;
    }
    exports.fromRegistry = fromRegistry;
    function spreadChildren(children, child) {
        if (Array.isArray(child)) {
            return child.reduce(spreadChildren, children);
        }
        else {
            return tslib_1.__spread(children, [child]);
        }
    }
    function tsx(tag, properties) {
        if (properties === void 0) { properties = {}; }
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        children = children.reduce(spreadChildren, []);
        properties = properties === null ? {} : properties;
        if (typeof tag === 'string') {
            return d_1.v(tag, properties, children);
        }
        else if (tag.type === exports.REGISTRY_ITEM) {
            var registryItem = new tag();
            return d_1.w(registryItem.name, properties, children);
        }
        else {
            return d_1.w(tag, properties, children);
        }
    }
    exports.tsx = tsx;
});
//# sourceMappingURL=tsx.js.map