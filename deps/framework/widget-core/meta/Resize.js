(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Base", "../../shim/Map"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Base_1 = require("./Base");
    var Map_1 = require("../../shim/Map");
    var Resize = /** @class */ (function (_super) {
        tslib_1.__extends(Resize, _super);
        function Resize() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._details = new Map_1.default();
            return _this;
        }
        Resize.prototype.get = function (key, predicates) {
            var _this = this;
            if (predicates === void 0) { predicates = {}; }
            var node = this.getNode(key);
            if (!node) {
                var defaultResponse = {};
                for (var predicateId in predicates) {
                    defaultResponse[predicateId] = false;
                }
                return defaultResponse;
            }
            if (!this._details.has(key)) {
                this._details.set(key, {});
                var resizeObserver = new ResizeObserver(function (_a) {
                    var _b = tslib_1.__read(_a, 1), entry = _b[0];
                    var predicateChanged = false;
                    if (Object.keys(predicates).length) {
                        var contentRect = entry.contentRect;
                        var previousDetails = _this._details.get(key);
                        var predicateResponses = {};
                        for (var predicateId in predicates) {
                            var response = predicates[predicateId](contentRect);
                            predicateResponses[predicateId] = response;
                            if (!predicateChanged && response !== previousDetails[predicateId]) {
                                predicateChanged = true;
                            }
                        }
                        _this._details.set(key, predicateResponses);
                    }
                    else {
                        predicateChanged = true;
                    }
                    predicateChanged && _this.invalidate();
                });
                resizeObserver.observe(node);
            }
            return this._details.get(key);
        };
        return Resize;
    }(Base_1.Base));
    exports.Resize = Resize;
    exports.default = Resize;
});
//# sourceMappingURL=Resize.js.map