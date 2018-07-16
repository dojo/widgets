(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../shim/global"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var global_1 = require("../../shim/global");
    var HashHistory = /** @class */ (function () {
        function HashHistory(_a) {
            var _b = _a.window, window = _b === void 0 ? global_1.default.window : _b, onChange = _a.onChange;
            var _this = this;
            this._onChange = function () {
                _this._current = _this.normalizePath(_this._window.location.hash);
                _this._onChangeFunction(_this._current);
            };
            this._onChangeFunction = onChange;
            this._window = window;
            this._window.addEventListener('hashchange', this._onChange, false);
            this._current = this.normalizePath(this._window.location.hash);
            this._onChangeFunction(this._current);
        }
        HashHistory.prototype.normalizePath = function (path) {
            return path.replace('#', '');
        };
        HashHistory.prototype.prefix = function (path) {
            if (path[0] !== '#') {
                return "#" + path;
            }
            return path;
        };
        HashHistory.prototype.set = function (path) {
            this._window.location.hash = this.prefix(path);
        };
        Object.defineProperty(HashHistory.prototype, "current", {
            get: function () {
                return this._current;
            },
            enumerable: true,
            configurable: true
        });
        HashHistory.prototype.destroy = function () {
            this._window.removeEventListener('hashchange', this._onChange);
        };
        return HashHistory;
    }());
    exports.HashHistory = HashHistory;
    exports.default = HashHistory;
});
//# sourceMappingURL=HashHistory.js.map