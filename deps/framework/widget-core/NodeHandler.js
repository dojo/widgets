(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../core/Evented", "../shim/Map"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Evented_1 = require("../core/Evented");
    var Map_1 = require("../shim/Map");
    /**
     * Enum to identify the type of event.
     * Listening to 'Projector' will notify when projector is created or updated
     * Listening to 'Widget' will notify when widget root is created or updated
     */
    var NodeEventType;
    (function (NodeEventType) {
        NodeEventType["Projector"] = "Projector";
        NodeEventType["Widget"] = "Widget";
    })(NodeEventType = exports.NodeEventType || (exports.NodeEventType = {}));
    var NodeHandler = /** @class */ (function (_super) {
        tslib_1.__extends(NodeHandler, _super);
        function NodeHandler() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._nodeMap = new Map_1.default();
            return _this;
        }
        NodeHandler.prototype.get = function (key) {
            return this._nodeMap.get(key);
        };
        NodeHandler.prototype.has = function (key) {
            return this._nodeMap.has(key);
        };
        NodeHandler.prototype.add = function (element, key) {
            this._nodeMap.set(key, element);
            this.emit({ type: key });
        };
        NodeHandler.prototype.addRoot = function () {
            this.emit({ type: NodeEventType.Widget });
        };
        NodeHandler.prototype.addProjector = function () {
            this.emit({ type: NodeEventType.Projector });
        };
        NodeHandler.prototype.clear = function () {
            this._nodeMap.clear();
        };
        return NodeHandler;
    }(Evented_1.Evented));
    exports.NodeHandler = NodeHandler;
    exports.default = NodeHandler;
});
//# sourceMappingURL=NodeHandler.js.map