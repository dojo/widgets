(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../shim/global", "../../shim/WeakMap", "../../shim/Map", "../../core/lang", "./Base"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var global_1 = require("../../shim/global");
    var WeakMap_1 = require("../../shim/WeakMap");
    var Map_1 = require("../../shim/Map");
    var lang_1 = require("../../core/lang");
    var Base_1 = require("./Base");
    var defaultIntersection = Object.freeze({
        intersectionRatio: 0,
        isIntersecting: false
    });
    var Intersection = /** @class */ (function (_super) {
        tslib_1.__extends(Intersection, _super);
        function Intersection() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._details = new Map_1.default();
            _this._onIntersect = function (detailEntries) {
                return function (entries) {
                    try {
                        for (var entries_1 = tslib_1.__values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                            var _a = entries_1_1.value, intersectionRatio = _a.intersectionRatio, isIntersecting = _a.isIntersecting, target = _a.target;
                            detailEntries.set(target, { intersectionRatio: intersectionRatio, isIntersecting: isIntersecting });
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (entries_1_1 && !entries_1_1.done && (_b = entries_1.return)) _b.call(entries_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    _this.invalidate();
                    var e_1, _b;
                };
            };
            return _this;
        }
        /**
         * Return an `InteractionResult` for the requested key and options.
         *
         * @param key The key to return the intersection meta for
         * @param options The options for the request
         */
        Intersection.prototype.get = function (key, options) {
            if (options === void 0) { options = {}; }
            var rootNode;
            if (options.root) {
                rootNode = this.getNode(options.root);
                if (!rootNode) {
                    return defaultIntersection;
                }
            }
            var node = this.getNode(key);
            if (!node) {
                return defaultIntersection;
            }
            var details = this._getDetails(options) || this._createDetails(options, rootNode);
            if (!details.entries.get(node)) {
                details.entries.set(node, defaultIntersection);
                details.observer.observe(node);
            }
            return details.entries.get(node) || defaultIntersection;
        };
        /**
         * Returns true if the node for the key has intersection details
         *
         * @param key The key to return the intersection meta for
         * @param options The options for the request
         */
        Intersection.prototype.has = function (key, options) {
            var node = this.getNode(key);
            var details = this._getDetails(options);
            return Boolean(details && node && details.entries.has(node));
        };
        Intersection.prototype._createDetails = function (options, rootNode) {
            var entries = new WeakMap_1.default();
            var observer = new global_1.default.IntersectionObserver(this._onIntersect(entries), tslib_1.__assign({}, options, { root: rootNode }));
            var details = tslib_1.__assign({ observer: observer, entries: entries }, options);
            this._details.set(JSON.stringify(options), details);
            this.own(lang_1.createHandle(function () { return observer.disconnect(); }));
            return details;
        };
        Intersection.prototype._getDetails = function (options) {
            if (options === void 0) { options = {}; }
            return this._details.get(JSON.stringify(options));
        };
        return Intersection;
    }(Base_1.Base));
    exports.Intersection = Intersection;
    exports.default = Intersection;
});
//# sourceMappingURL=Intersection.js.map