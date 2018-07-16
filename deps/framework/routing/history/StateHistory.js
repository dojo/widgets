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
    var StateHistory = /** @class */ (function () {
        function StateHistory(_a) {
            var onChange = _a.onChange, _b = _a.window, window = _b === void 0 ? global_1.default.window : _b, _c = _a.base, base = _c === void 0 ? '/' : _c;
            var _this = this;
            this._onChange = function () {
                var value = stripBase(_this._base, _this._window.location.pathname + _this._window.location.search);
                if (_this._current === value) {
                    return;
                }
                _this._current = value;
                _this._onChangeFunction(_this._current);
            };
            if (/(#|\?)/.test(base)) {
                throw new TypeError("base must not contain '#' or '?'");
            }
            this._onChangeFunction = onChange;
            this._window = window;
            this._base = base;
            this._current = this._window.location.pathname + this._window.location.search;
            this._window.addEventListener('popstate', this._onChange, false);
            this._onChange();
        }
        StateHistory.prototype.prefix = function (path) {
            var baseEndsWithSlash = /\/$/.test(this._base);
            var pathStartsWithSlash = /^\//.test(path);
            if (baseEndsWithSlash && pathStartsWithSlash) {
                return this._base + path.slice(1);
            }
            else if (!baseEndsWithSlash && !pathStartsWithSlash) {
                return this._base + "/" + path;
            }
            else {
                return this._base + path;
            }
        };
        StateHistory.prototype.set = function (path) {
            var value = ensureLeadingSlash(path);
            this._window.history.pushState({}, '', this.prefix(value));
            this._onChange();
        };
        Object.defineProperty(StateHistory.prototype, "current", {
            get: function () {
                return this._current;
            },
            enumerable: true,
            configurable: true
        });
        return StateHistory;
    }());
    exports.StateHistory = StateHistory;
    function stripBase(base, path) {
        if (base === '/') {
            return path;
        }
        if (path.indexOf(base) === 0) {
            return ensureLeadingSlash(path.slice(base.length));
        }
        else {
            return '/';
        }
    }
    function ensureLeadingSlash(path) {
        if (path[0] !== '/') {
            return "/" + path;
        }
        return path;
    }
    exports.default = StateHistory;
});
//# sourceMappingURL=StateHistory.js.map