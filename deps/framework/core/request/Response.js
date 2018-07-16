(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../shim/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise_1 = require("../../shim/Promise");
    var Response = /** @class */ (function () {
        function Response() {
        }
        Response.prototype.json = function () {
            return this.text().then(JSON.parse);
        };
        return Response;
    }());
    exports.default = Response;
    function getFileReaderPromise(reader) {
        return new Promise_1.default(function (resolve, reject) {
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject(reader.error);
            };
        });
    }
    exports.getFileReaderPromise = getFileReaderPromise;
    function getTextFromBlob(blob) {
        var reader = new FileReader();
        var promise = getFileReaderPromise(reader);
        reader.readAsText(blob);
        return promise;
    }
    exports.getTextFromBlob = getTextFromBlob;
    function getArrayBufferFromBlob(blob) {
        var reader = new FileReader();
        var promise = getFileReaderPromise(reader);
        reader.readAsArrayBuffer(blob);
        return promise;
    }
    exports.getArrayBufferFromBlob = getArrayBufferFromBlob;
    function getTextFromArrayBuffer(buffer) {
        var view = new Uint8Array(buffer);
        var chars = [];
        view.forEach(function (charCode, index) {
            chars[index] = String.fromCharCode(charCode);
        });
        return chars.join('');
    }
    exports.getTextFromArrayBuffer = getTextFromArrayBuffer;
});
//# sourceMappingURL=Response.js.map