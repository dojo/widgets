(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../widget-core/WidgetBase", "../widget-core/d", "../widget-core/decorators/inject"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var WidgetBase_1 = require("../widget-core/WidgetBase");
    var d_1 = require("../widget-core/d");
    var inject_1 = require("../widget-core/decorators/inject");
    var getProperties = function (router, properties) {
        var to = properties.to, _a = properties.isOutlet, isOutlet = _a === void 0 ? true : _a, _b = properties.params, params = _b === void 0 ? {} : _b, onClick = properties.onClick, props = tslib_1.__rest(properties, ["to", "isOutlet", "params", "onClick"]);
        var href = isOutlet ? router.link(to, params) : to;
        var handleOnClick = function (event) {
            onClick && onClick(event);
            if (!event.defaultPrevented && event.button === 0 && !properties.target) {
                event.preventDefault();
                href !== undefined && router.setPath(href);
            }
        };
        return tslib_1.__assign({ href: href, onClick: handleOnClick }, props);
    };
    var BaseLink = /** @class */ (function (_super) {
        tslib_1.__extends(BaseLink, _super);
        function BaseLink() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseLink.prototype._onClick = function (event) {
            this.properties.onClick && this.properties.onClick(event);
        };
        BaseLink.prototype.render = function () {
            var props = tslib_1.__assign({}, this.properties, { onclick: this._onClick, onClick: undefined, to: undefined, isOutlet: undefined, params: undefined, routerKey: undefined, router: undefined });
            return d_1.v('a', props, this.children);
        };
        return BaseLink;
    }(WidgetBase_1.WidgetBase));
    exports.BaseLink = BaseLink;
    function createLink(routerKey) {
        var Link = /** @class */ (function (_super) {
            tslib_1.__extends(Link, _super);
            function Link() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Link = tslib_1.__decorate([
                inject_1.inject({ name: routerKey, getProperties: getProperties })
            ], Link);
            return Link;
        }(BaseLink));
        return Link;
    }
    exports.createLink = createLink;
    exports.Link = createLink('router');
    exports.default = exports.Link;
});
//# sourceMappingURL=Link.js.map