(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../core/Destroyable", "../../shim/Set"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Destroyable_1 = require("../../core/Destroyable");
    var Set_1 = require("../../shim/Set");
    var Base = /** @class */ (function (_super) {
        tslib_1.__extends(Base, _super);
        function Base(properties) {
            var _this = _super.call(this) || this;
            _this._requestedNodeKeys = new Set_1.default();
            _this._invalidate = properties.invalidate;
            _this.nodeHandler = properties.nodeHandler;
            if (properties.bind) {
                _this._bind = properties.bind;
            }
            return _this;
        }
        Base.prototype.has = function (key) {
            return this.nodeHandler.has(key);
        };
        Base.prototype.getNode = function (key) {
            var _this = this;
            var stringKey = "" + key;
            var node = this.nodeHandler.get(stringKey);
            if (!node && !this._requestedNodeKeys.has(stringKey)) {
                var handle_1 = this.nodeHandler.on(stringKey, function () {
                    handle_1.destroy();
                    _this._requestedNodeKeys.delete(stringKey);
                    _this.invalidate();
                });
                this.own(handle_1);
                this._requestedNodeKeys.add(stringKey);
            }
            return node;
        };
        Base.prototype.invalidate = function () {
            this._invalidate();
        };
        Base.prototype.afterRender = function () {
            // Do nothing by default.
        };
        return Base;
    }(Destroyable_1.Destroyable));
    exports.Base = Base;
    exports.default = Base;
});
//# sourceMappingURL=Base.js.map