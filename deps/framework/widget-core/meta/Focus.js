(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Base", "../../core/lang", "../../shim/global"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Base_1 = require("./Base");
    var lang_1 = require("../../core/lang");
    var global_1 = require("../../shim/global");
    var defaultResults = {
        active: false,
        containsFocus: false
    };
    var Focus = /** @class */ (function (_super) {
        tslib_1.__extends(Focus, _super);
        function Focus() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._onFocusChange = function () {
                _this._activeElement = global_1.default.document.activeElement;
                _this.invalidate();
            };
            return _this;
        }
        Focus.prototype.get = function (key) {
            var node = this.getNode(key);
            if (!node) {
                return tslib_1.__assign({}, defaultResults);
            }
            if (!this._activeElement) {
                this._activeElement = global_1.default.document.activeElement;
                this._createListener();
            }
            return {
                active: node === this._activeElement,
                containsFocus: !!this._activeElement && node.contains(this._activeElement)
            };
        };
        Focus.prototype.set = function (key) {
            var node = this.getNode(key);
            node && node.focus();
        };
        Focus.prototype._createListener = function () {
            global_1.default.document.addEventListener('focusin', this._onFocusChange);
            global_1.default.document.addEventListener('focusout', this._onFocusChange);
            this.own(lang_1.createHandle(this._removeListener.bind(this)));
        };
        Focus.prototype._removeListener = function () {
            global_1.default.document.removeEventListener('focusin', this._onFocusChange);
            global_1.default.document.removeEventListener('focusout', this._onFocusChange);
        };
        return Focus;
    }(Base_1.Base));
    exports.Focus = Focus;
    exports.default = Focus;
});
//# sourceMappingURL=Focus.js.map