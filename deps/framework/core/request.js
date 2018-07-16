(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../has/has", "./async/Task", "./request/ProviderRegistry", "./request/providers/xhr", "./request/Headers", "./request/TimeoutError"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    Object.defineProperty(exports, "__esModule", { value: true });
    var has_1 = require("../has/has");
    var Task_1 = require("./async/Task");
    var ProviderRegistry_1 = require("./request/ProviderRegistry");
    var xhr_1 = require("./request/providers/xhr");
    exports.providerRegistry = new ProviderRegistry_1.default();
    var request = function request(url, options) {
        if (options === void 0) { options = {}; }
        try {
            return exports.providerRegistry.match(url, options)(url, options);
        }
        catch (error) {
            return Task_1.default.reject(error);
        }
    };
    ['DELETE', 'GET', 'HEAD', 'OPTIONS'].forEach(function (method) {
        Object.defineProperty(request, method.toLowerCase(), {
            value: function (url, options) {
                if (options === void 0) { options = {}; }
                options = Object.create(options);
                options.method = method;
                return request(url, options);
            }
        });
    });
    ['POST', 'PUT'].forEach(function (method) {
        Object.defineProperty(request, method.toLowerCase(), {
            value: function (url, options) {
                if (options === void 0) { options = {}; }
                options = Object.create(options);
                options.method = method;
                return request(url, options);
            }
        });
    });
    Object.defineProperty(request, 'setDefaultProvider', {
        value: function (provider) {
            exports.providerRegistry.setDefaultProvider(provider);
        }
    });
    exports.providerRegistry.setDefaultProvider(xhr_1.default);
    if (has_1.default('host-node')) {
        // tslint:disable-next-line
        (__syncRequire ? Promise.resolve().then(function () { return require('./request/providers/node'); }) : new Promise(function (resolve_1, reject_1) { require(['./request/providers/node'], resolve_1, reject_1); })).then(function (node) {
            exports.providerRegistry.setDefaultProvider(node.default);
        });
    }
    exports.default = request;
    var Headers_1 = require("./request/Headers");
    exports.Headers = Headers_1.default;
    var TimeoutError_1 = require("./request/TimeoutError");
    exports.TimeoutError = TimeoutError_1.default;
});
//# sourceMappingURL=request.js.map