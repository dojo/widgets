(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../shim/global", "../has/has"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var global_1 = require("../shim/global");
    var has_1 = require("../has/has");
    has_1.add('btoa', 'btoa' in global_1.default, true);
    has_1.add('atob', 'atob' in global_1.default, true);
    /**
     * Take a string encoded in base64 and decode it
     * @param encodedString The base64 encoded string
     */
    exports.decode = has_1.default('atob')
        ? function (encodedString) {
            /* this allows for utf8 characters to be decoded properly */
            return decodeURIComponent(Array.prototype.map
                .call(atob(encodedString), function (char) { return '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2); })
                .join(''));
        }
        : function (encodedString) {
            return new Buffer(encodedString.toString(), 'base64').toString('utf8');
        };
    /**
     * Take a string and encode it to base64
     * @param rawString The string to encode
     */
    exports.encode = has_1.default('btoa')
        ? function (decodedString) {
            /* this allows for utf8 characters to be encoded properly */
            return btoa(encodeURIComponent(decodedString).replace(/%([0-9A-F]{2})/g, function (match, code) {
                return String.fromCharCode(Number('0x' + code));
            }));
        }
        : function (rawString) {
            return new Buffer(rawString.toString(), 'utf8').toString('base64');
        };
});
//# sourceMappingURL=base64.js.map