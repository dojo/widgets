(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./StoreInjector", "./StoreInjector"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StoreInjector_1 = require("./StoreInjector");
    var StoreInjector_2 = require("./StoreInjector");
    exports.StoreContainer = StoreInjector_2.StoreContainer;
    exports.createStoreContainer = StoreInjector_2.createStoreContainer;
    exports.default = StoreInjector_1.StoreContainer;
});
//# sourceMappingURL=StoreContainer.js.map