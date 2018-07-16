(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../core/Evented"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Evented_1 = require("../core/Evented");
    var Injector = /** @class */ (function (_super) {
        tslib_1.__extends(Injector, _super);
        function Injector(payload) {
            var _this = _super.call(this) || this;
            _this._payload = payload;
            return _this;
        }
        Injector.prototype.setInvalidator = function (invalidator) {
            this._invalidator = invalidator;
        };
        Injector.prototype.get = function () {
            return this._payload;
        };
        Injector.prototype.set = function (payload) {
            this._payload = payload;
            if (this._invalidator) {
                this._invalidator();
            }
        };
        return Injector;
    }(Evented_1.Evented));
    exports.Injector = Injector;
    exports.default = Injector;
});
//# sourceMappingURL=Injector.js.map