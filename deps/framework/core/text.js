(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../shim/Promise", "./has", "./request", "./load"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise_1 = require("../shim/Promise");
    var has_1 = require("./has");
    var request_1 = require("./request");
    var load_1 = require("./load");
    /*
     * Strips <?xml ...?> declarations so that external SVG and XML
     * documents can be added to a document without worry. Also, if the string
     * is an HTML document, only the part inside the body tag is returned.
     */
    function strip(text) {
        if (!text) {
            return '';
        }
        text = text.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, '');
        var matches = text.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
        text = matches ? matches[1] : text;
        return text;
    }
    /*
     * Host-specific method to retrieve text
     */
    var getText;
    if (has_1.default('host-browser')) {
        getText = function (url, callback) {
            request_1.default(url).then(function (response) {
                response.text().then(function (data) {
                    callback(data);
                });
            });
        };
    }
    else if (has_1.default('host-node')) {
        var fs_1 = load_1.isAmdRequire(require) && require.nodeRequire ? require.nodeRequire('fs') : require('fs');
        getText = function (url, callback) {
            fs_1.readFile(url, { encoding: 'utf8' }, function (error, data) {
                if (error) {
                    throw error;
                }
                callback(data);
            });
        };
    }
    else {
        getText = function () {
            throw new Error('dojo/text not supported on this platform');
        };
    }
    /*
     * Cache of previously-loaded text resources
     */
    var textCache = {};
    /*
     * Cache of pending text resources
     */
    var pending = {};
    function get(url) {
        var promise = new Promise_1.default(function (resolve, reject) {
            getText(url, function (text) {
                resolve(text);
            });
        });
        return promise;
    }
    exports.get = get;
    function normalize(id, toAbsMid) {
        var parts = id.split('!');
        var url = parts[0];
        return (/^\./.test(url) ? toAbsMid(url) : url) + (parts[1] ? '!' + parts[1] : '');
    }
    exports.normalize = normalize;
    function load(id, require, load, config) {
        var parts = id.split('!');
        var stripFlag = parts.length > 1;
        var mid = parts[0];
        var url = require.toUrl(mid);
        var text;
        function finish(text) {
            load(stripFlag ? strip(text) : text);
        }
        if (mid in textCache) {
            text = textCache[mid];
        }
        else if (url in textCache) {
            text = textCache[url];
        }
        if (!text) {
            if (pending[url]) {
                pending[url].push(finish);
            }
            else {
                var pendingList_1 = (pending[url] = [finish]);
                getText(url, function (value) {
                    textCache[mid] = textCache[url] = value;
                    for (var i = 0; i < pendingList_1.length;) {
                        pendingList_1[i++](value || '');
                    }
                    delete pending[url];
                });
            }
        }
        else {
            finish(text);
        }
    }
    exports.load = load;
});
//# sourceMappingURL=text.js.map