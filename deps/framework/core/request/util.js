(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../UrlSearchParams"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var UrlSearchParams_1 = require("../UrlSearchParams");
    /**
     * Returns a URL formatted with optional query string and cache-busting segments.
     *
     * @param url The base URL.
     * @param options The RequestOptions used to generate the query string or cacheBust.
     */
    function generateRequestUrl(url, options) {
        if (options === void 0) { options = {}; }
        var query = new UrlSearchParams_1.default(options.query).toString();
        if (options.cacheBust) {
            var bustString = String(Date.now());
            query += query ? "&" + bustString : bustString;
        }
        var separator = url.indexOf('?') > -1 ? '&' : '?';
        return query ? "" + url + separator + query : url;
    }
    exports.generateRequestUrl = generateRequestUrl;
    function getStringFromFormData(formData) {
        var fields = [];
        try {
            for (var _a = tslib_1.__values(formData.keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var key = _b.value;
                fields.push(encodeURIComponent(key) + '=' + encodeURIComponent(formData.get(key)));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return fields.join('&');
        var e_1, _c;
    }
    exports.getStringFromFormData = getStringFromFormData;
});
//# sourceMappingURL=util.js.map