(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./WidgetBase", "./decorators/inject", "./d", "./decorators/alwaysRender"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var WidgetBase_1 = require("./WidgetBase");
    var inject_1 = require("./decorators/inject");
    var d_1 = require("./d");
    var alwaysRender_1 = require("./decorators/alwaysRender");
    function Container(component, name, _a) {
        var getProperties = _a.getProperties;
        var WidgetContainer = /** @class */ (function (_super) {
            tslib_1.__extends(WidgetContainer, _super);
            function WidgetContainer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            WidgetContainer.prototype.render = function () {
                return d_1.w(component, this.properties, this.children);
            };
            WidgetContainer = tslib_1.__decorate([
                alwaysRender_1.alwaysRender(),
                inject_1.inject({ name: name, getProperties: getProperties })
            ], WidgetContainer);
            return WidgetContainer;
        }(WidgetBase_1.WidgetBase));
        return WidgetContainer;
    }
    exports.Container = Container;
    exports.default = Container;
});
//# sourceMappingURL=Container.js.map