(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Base"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Base_1 = require("./Base");
    var Matches = /** @class */ (function (_super) {
        tslib_1.__extends(Matches, _super);
        function Matches() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Determine if the target of a particular `Event` matches the virtual DOM key
         * @param key The virtual DOM key
         * @param event The event object
         */
        Matches.prototype.get = function (key, event) {
            return this.getNode(key) === event.target;
        };
        return Matches;
    }(Base_1.Base));
    exports.default = Matches;
});
//# sourceMappingURL=Matches.js.map