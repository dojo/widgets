(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../MatchRegistry"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var MatchRegistry_1 = require("../MatchRegistry");
    var ProviderRegistry = /** @class */ (function (_super) {
        tslib_1.__extends(ProviderRegistry, _super);
        function ProviderRegistry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ProviderRegistry.prototype.setDefaultProvider = function (provider) {
            this._defaultValue = provider;
        };
        ProviderRegistry.prototype.register = function (test, value, first) {
            var entryTest;
            if (typeof test === 'string') {
                entryTest = function (url, options) { return test === url; };
            }
            else if (test instanceof RegExp) {
                entryTest = function (url, options) {
                    return test ? test.test(url) : null;
                };
            }
            else {
                entryTest = test;
            }
            return _super.prototype.register.call(this, entryTest, value, first);
        };
        return ProviderRegistry;
    }(MatchRegistry_1.default));
    exports.ProviderRegistry = ProviderRegistry;
    exports.default = ProviderRegistry;
});
//# sourceMappingURL=ProviderRegistry.js.map