(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../shim/Promise", "./util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Promise_1 = require("../../shim/Promise");
    var util_1 = require("./util");
    exports.isPlugin = util_1.isPlugin;
    exports.useDefault = util_1.useDefault;
    /**
     * @private
     * Resolves an absolute path from an absolute base path and relative module ID.
     *
     * @param base
     * The absolute base path.
     *
     * @param mid
     * The relative module ID
     *
     * @return
     * The resolved absolute module path.
     */
    function resolveRelative(base, mid) {
        var isRelative = mid.match(/^\.+\//);
        var result = base;
        if (isRelative) {
            if (mid.match(/^\.\//)) {
                mid = mid.replace(/\.\//, '');
            }
            var up = mid.match(/\.\.\//g);
            if (up) {
                var chunks = base.split('/');
                if (up.length > chunks.length) {
                    throw new Error('Path cannot go beyond root directory.');
                }
                chunks.splice(chunks.length - up.length);
                result = chunks.join('/');
                mid = mid.replace(/\.\.\//g, '');
            }
            mid = result + '/' + mid;
        }
        return mid;
    }
    /**
     * @private
     * Returns the parent directory for the specified module ID.
     *
     * @param context
     * A function that returns the context module ID.
     *
     * @return
     * The parent directory of the path returned by the context function.
     */
    function getBasePath(context) {
        return context()
            .split('/')
            .slice(0, -1)
            .join('/');
    }
    function load() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var req = __webpack_require__;
        var context = typeof args[0] === 'function'
            ? args[0]
            : function () {
                return '';
            };
        var modules = __modules__ || {};
        var base = getBasePath(context);
        var results = args
            .filter(function (mid) { return typeof mid === 'string'; })
            .map(function (mid) { return resolveRelative(base, mid); })
            .map(function (mid) {
            var _a = tslib_1.__read(mid.split('!'), 2), moduleId = _a[0], pluginResourceId = _a[1];
            var moduleMeta = modules[mid] || modules[moduleId];
            if (!moduleMeta) {
                return Promise_1.default.reject(new Error("Missing module: " + mid));
            }
            if (moduleMeta.lazy) {
                return new Promise_1.default(function (resolve) { return req(moduleMeta.id)(resolve); });
            }
            var module = req(moduleMeta.id);
            var defaultExport = module['default'] || module;
            if (util_1.isPlugin(defaultExport)) {
                pluginResourceId =
                    typeof defaultExport.normalize === 'function'
                        ? defaultExport.normalize(pluginResourceId, function (mid) { return resolveRelative(base, mid); })
                        : resolveRelative(base, pluginResourceId);
                return Promise_1.default.resolve(defaultExport.load(pluginResourceId, load));
            }
            return Promise_1.default.resolve(module);
        });
        return Promise_1.default.all(results);
    }
    exports.default = load;
});
//# sourceMappingURL=webpack.js.map