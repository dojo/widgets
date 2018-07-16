(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../shim/global", "./instrument"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var global_1 = require("../shim/global");
    var instrument_1 = require("./instrument");
    instrument_1.deprecated({
        message: 'has been replaced with @dojo/framework/shim/global',
        name: '@dojo/framework/core/global',
        url: 'https://github.com/dojo/core/issues/302'
    });
    exports.default = global_1.default;
});
//# sourceMappingURL=global.js.map