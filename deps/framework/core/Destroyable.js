(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./lang", "../shim/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var lang_1 = require("./lang");
    var Promise_1 = require("../shim/Promise");
    /**
     * No operation function to replace own once instance is destoryed
     */
    function noop() {
        return Promise_1.default.resolve(false);
    }
    /**
     * No op function used to replace own, once instance has been destoryed
     */
    function destroyed() {
        throw new Error('Call made to destroyed method');
    }
    var Destroyable = /** @class */ (function () {
        /**
         * @constructor
         */
        function Destroyable() {
            this.handles = [];
        }
        /**
         * Register handles for the instance that will be destroyed when `this.destroy` is called
         *
         * @param {Handle} handle The handle to add for the instance
         * @returns {Handle} a handle for the handle, removes the handle for the instance and calls destroy
         */
        Destroyable.prototype.own = function (handles) {
            var handle = Array.isArray(handles) ? lang_1.createCompositeHandle.apply(void 0, tslib_1.__spread(handles)) : handles;
            var _handles = this.handles;
            _handles.push(handle);
            return {
                destroy: function () {
                    _handles.splice(_handles.indexOf(handle));
                    handle.destroy();
                }
            };
        };
        /**
         * Destrpys all handers registered for the instance
         *
         * @returns {Promise<any} a promise that resolves once all handles have been destroyed
         */
        Destroyable.prototype.destroy = function () {
            var _this = this;
            return new Promise_1.default(function (resolve) {
                _this.handles.forEach(function (handle) {
                    handle && handle.destroy && handle.destroy();
                });
                _this.destroy = noop;
                _this.own = destroyed;
                resolve(true);
            });
        };
        return Destroyable;
    }());
    exports.Destroyable = Destroyable;
    exports.default = Destroyable;
});
//# sourceMappingURL=Destroyable.js.map