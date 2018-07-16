(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MemoryHistory = /** @class */ (function () {
        function MemoryHistory(_a) {
            var onChange = _a.onChange;
            this._current = '/';
            this._onChangeFunction = onChange;
            this._onChange();
        }
        MemoryHistory.prototype.prefix = function (path) {
            return path;
        };
        MemoryHistory.prototype.set = function (path) {
            if (this._current === path) {
                return;
            }
            this._current = path;
            this._onChange();
        };
        Object.defineProperty(MemoryHistory.prototype, "current", {
            get: function () {
                return this._current;
            },
            enumerable: true,
            configurable: true
        });
        MemoryHistory.prototype._onChange = function () {
            this._onChangeFunction(this._current);
        };
        return MemoryHistory;
    }());
    exports.MemoryHistory = MemoryHistory;
    exports.default = MemoryHistory;
});
//# sourceMappingURL=MemoryHistory.js.map