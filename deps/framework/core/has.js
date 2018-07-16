(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/global", "../shim/support/has", "../shim/support/has"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var global_1 = require("../shim/global");
    var has_1 = require("../shim/support/has");
    tslib_1.__exportStar(require("../shim/support/has"), exports);
    exports.default = has_1.default;
    has_1.add('object-assign', typeof global_1.default.Object.assign === 'function', true);
    has_1.add('arraybuffer', typeof global_1.default.ArrayBuffer !== 'undefined', true);
    has_1.add('formdata', typeof global_1.default.FormData !== 'undefined', true);
    has_1.add('filereader', typeof global_1.default.FileReader !== 'undefined', true);
    has_1.add('xhr', typeof global_1.default.XMLHttpRequest !== 'undefined', true);
    has_1.add('xhr2', has_1.default('xhr') && 'responseType' in global_1.default.XMLHttpRequest.prototype, true);
    has_1.add('blob', function () {
        if (!has_1.default('xhr2')) {
            return false;
        }
        var request = new global_1.default.XMLHttpRequest();
        request.open('GET', global_1.default.location.protocol + '//www.google.com', true);
        request.responseType = 'blob';
        request.abort();
        return request.responseType === 'blob';
    }, true);
    has_1.add('node-buffer', 'Buffer' in global_1.default && typeof global_1.default.Buffer === 'function', true);
    has_1.add('fetch', 'fetch' in global_1.default && typeof global_1.default.fetch === 'function', true);
    has_1.add('web-worker-xhr-upload', typeof global_1.default.Promise !== 'undefined' &&
        new Promise(function (resolve) {
            try {
                if (global_1.default.Worker !== undefined && global_1.default.URL && global_1.default.URL.createObjectURL) {
                    var blob = new Blob([
                        "(function () {\nself.addEventListener('message', function () {\n\tvar xhr = new XMLHttpRequest();\n\ttry {\n\t\txhr.upload;\n\t\tpostMessage('true');\n\t} catch (e) {\n\t\tpostMessage('false');\n\t}\n});\n\t\t})()"
                    ], { type: 'application/javascript' });
                    var worker = new Worker(URL.createObjectURL(blob));
                    worker.addEventListener('message', function (_a) {
                        var result = _a.data;
                        resolve(result === 'true');
                    });
                    worker.postMessage({});
                }
                else {
                    resolve(false);
                }
            }
            catch (e) {
                // IE11 on Winodws 8.1 encounters a security error.
                resolve(false);
            }
        }), true);
});
//# sourceMappingURL=has.js.map