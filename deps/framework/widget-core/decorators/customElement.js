(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../registerCustomElement", "../Registry"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var registerCustomElement_1 = require("../registerCustomElement");
    var Registry_1 = require("../Registry");
    /**
     * This Decorator is provided properties that define the behavior of a custom element, and
     * registers that custom element.
     */
    function customElement(_a) {
        var tag = _a.tag, _b = _a.properties, properties = _b === void 0 ? [] : _b, _c = _a.attributes, attributes = _c === void 0 ? [] : _c, _d = _a.events, events = _d === void 0 ? [] : _d, _e = _a.childType, childType = _e === void 0 ? registerCustomElement_1.CustomElementChildType.DOJO : _e, _f = _a.registryFactory, registryFactory = _f === void 0 ? function () { return new Registry_1.default(); } : _f;
        return function (target) {
            target.prototype.__customElementDescriptor = {
                tagName: tag,
                attributes: attributes,
                properties: properties,
                events: events,
                childType: childType,
                registryFactory: registryFactory
            };
        };
    }
    exports.customElement = customElement;
    exports.default = customElement;
});
//# sourceMappingURL=customElement.js.map