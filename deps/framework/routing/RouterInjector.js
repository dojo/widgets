(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./Router"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Router_1 = require("./Router");
    /**
     * Creates a router instance for a specific History manager (default is `HashHistory`) and registers
     * the route configuration.
     *
     * @param config The route config to register for the router
     * @param registry An optional registry that defaults to the global registry
     * @param options The router injector options
     */
    function registerRouterInjector(config, registry, options) {
        if (options === void 0) { options = {}; }
        var _a = options.key, key = _a === void 0 ? 'router' : _a, routerOptions = tslib_1.__rest(options, ["key"]);
        if (registry.hasInjector(key)) {
            throw new Error('Router has already been defined');
        }
        var router = new Router_1.Router(config, routerOptions);
        registry.defineInjector(key, function (invalidator) {
            router.on('navstart', function () { return invalidator(); });
            return function () { return router; };
        });
        return router;
    }
    exports.registerRouterInjector = registerRouterInjector;
});
//# sourceMappingURL=RouterInjector.js.map