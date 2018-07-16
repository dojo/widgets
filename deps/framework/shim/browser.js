(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "pepjs", "intersection-observer", "web-animations-js/web-animations-next-lite.min"], factory);
    }
})(function (require, exports) {
    "use strict";
    "!has('dom-pointer-events')";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("pepjs");
    "!has('dom-intersection-observer')";
    require("intersection-observer");
    "!has('dom-webanimation')";
    require("web-animations-js/web-animations-next-lite.min");
});
//# sourceMappingURL=browser.js.map