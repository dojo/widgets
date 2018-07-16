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
    var escapeRegExpPattern = /[[\]{}()|\/\\^$.*+?]/g;
    var escapeXmlPattern = /[&<]/g;
    var escapeXmlForPattern = /[&<>'"]/g;
    var escapeXmlMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    /**
     * Escapes a string so that it can safely be passed to the RegExp constructor.
     * @param text The string to be escaped
     * @return The escaped string
     */
    function escapeRegExp(text) {
        return !text ? text : text.replace(escapeRegExpPattern, '\\$&');
    }
    exports.escapeRegExp = escapeRegExp;
    /**
     * Sanitizes a string to protect against tag injection.
     * @param xml The string to be escaped
     * @param forAttribute Whether to also escape ', ", and > in addition to < and &
     * @return The escaped string
     */
    function escapeXml(xml, forAttribute) {
        if (forAttribute === void 0) { forAttribute = true; }
        if (!xml) {
            return xml;
        }
        var pattern = forAttribute ? escapeXmlForPattern : escapeXmlPattern;
        return xml.replace(pattern, function (character) {
            return escapeXmlMap[character];
        });
    }
    exports.escapeXml = escapeXml;
});
//# sourceMappingURL=stringExtras.js.map