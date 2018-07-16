(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../core/Evented", "./state/Patch", "./state/Pointer", "../shim/Map"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Evented_1 = require("../core/Evented");
    var Patch_1 = require("./state/Patch");
    var Pointer_1 = require("./state/Pointer");
    var Map_1 = require("../shim/Map");
    function isString(segment) {
        return typeof segment === 'string';
    }
    /**
     * Application state store
     */
    var Store = /** @class */ (function (_super) {
        tslib_1.__extends(Store, _super);
        function Store() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * The private state object
             */
            _this._state = {};
            _this._changePaths = new Map_1.default();
            _this._callbackId = 0;
            /**
             * Returns the state at a specific pointer path location.
             */
            _this.get = function (path) {
                return path.value;
            };
            /**
             * Applies store operations to state and returns the undo operations
             */
            _this.apply = function (operations, invalidate) {
                if (invalidate === void 0) { invalidate = false; }
                var patch = new Patch_1.Patch(operations);
                var patchResult = patch.apply(_this._state);
                _this._state = patchResult.object;
                if (invalidate) {
                    _this.invalidate();
                }
                return patchResult.undoOperations;
            };
            _this.at = function (path, index) {
                var array = _this.get(path);
                var value = array && array[index];
                return {
                    path: path.path + "/" + index,
                    state: path.state,
                    value: value
                };
            };
            _this.onChange = function (paths, callback) {
                var callbackId = _this._callbackId;
                if (!Array.isArray(paths)) {
                    paths = [paths];
                }
                paths.forEach(function (path) { return _this._addOnChange(path, callback, callbackId); });
                _this._callbackId += 1;
                return {
                    remove: function () {
                        paths.forEach(function (path) {
                            var onChange = _this._changePaths.get(path.path);
                            if (onChange) {
                                onChange.callbacks = onChange.callbacks.filter(function (callback) {
                                    return callback.callbackId !== callbackId;
                                });
                            }
                        });
                    }
                };
            };
            _this._addOnChange = function (path, callback, callbackId) {
                var changePaths = _this._changePaths.get(path.path);
                if (!changePaths) {
                    changePaths = { callbacks: [], previousValue: _this.get(path) };
                }
                changePaths.callbacks.push({ callbackId: callbackId, callback: callback });
                _this._changePaths.set(path.path, changePaths);
            };
            _this.path = function (path) {
                var segments = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    segments[_i - 1] = arguments[_i];
                }
                if (typeof path === 'string') {
                    segments = tslib_1.__spread([path], segments);
                }
                else {
                    segments = tslib_1.__spread(new Pointer_1.Pointer(path.path).segments, segments);
                }
                var stringSegments = segments.filter(isString);
                var hasMultipleSegments = stringSegments.length > 1;
                var pointer = new Pointer_1.Pointer(hasMultipleSegments ? stringSegments : stringSegments[0] || '');
                return {
                    path: pointer.path,
                    state: _this._state,
                    value: pointer.get(_this._state)
                };
            };
            return _this;
        }
        Store.prototype._runOnChanges = function () {
            var _this = this;
            var callbackIdsCalled = [];
            this._changePaths.forEach(function (value, path) {
                var previousValue = value.previousValue, callbacks = value.callbacks;
                var newValue = new Pointer_1.Pointer(path).get(_this._state);
                if (previousValue !== newValue) {
                    _this._changePaths.set(path, { callbacks: callbacks, previousValue: newValue });
                    callbacks.forEach(function (callbackItem) {
                        var callback = callbackItem.callback, callbackId = callbackItem.callbackId;
                        if (callbackIdsCalled.indexOf(callbackId) === -1) {
                            callbackIdsCalled.push(callbackId);
                            callback();
                        }
                    });
                }
            });
        };
        /**
         * Emits an invalidation event
         */
        Store.prototype.invalidate = function () {
            this._runOnChanges();
            this.emit({ type: 'invalidate' });
        };
        return Store;
    }(Evented_1.Evented));
    exports.Store = Store;
    exports.default = Store;
});
//# sourceMappingURL=Store.js.map