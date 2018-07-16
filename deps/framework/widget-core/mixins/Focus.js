(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./../decorators/diffProperty"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var diffProperty_1 = require("./../decorators/diffProperty");
    function diffFocus(previousProperty, newProperty) {
        var result = newProperty && newProperty();
        return {
            changed: result,
            value: newProperty
        };
    }
    function FocusMixin(Base) {
        var Focus = /** @class */ (function (_super) {
            tslib_1.__extends(Focus, _super);
            function Focus() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._currentToken = 0;
                _this._previousToken = 0;
                _this.shouldFocus = function () {
                    var result = _this._currentToken !== _this._previousToken;
                    _this._previousToken = _this._currentToken;
                    return result;
                };
                return _this;
            }
            Focus.prototype.isFocusedReaction = function () {
                this._currentToken++;
            };
            Focus.prototype.focus = function () {
                this._currentToken++;
                this.invalidate();
            };
            tslib_1.__decorate([
                diffProperty_1.diffProperty('focus', diffFocus)
            ], Focus.prototype, "isFocusedReaction", null);
            return Focus;
        }(Base));
        return Focus;
    }
    exports.FocusMixin = FocusMixin;
    exports.default = FocusMixin;
});
//# sourceMappingURL=Focus.js.map