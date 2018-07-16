(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/Map", "./Destroyable"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Map_1 = require("../shim/Map");
    var Destroyable_1 = require("./Destroyable");
    /**
     * Map of computed regular expressions, keyed by string
     */
    var regexMap = new Map_1.default();
    /**
     * Determines is the event type glob has been matched
     *
     * @returns boolean that indicates if the glob is matched
     */
    function isGlobMatch(globString, targetString) {
        if (typeof targetString === 'string' && typeof globString === 'string' && globString.indexOf('*') !== -1) {
            var regex = void 0;
            if (regexMap.has(globString)) {
                regex = regexMap.get(globString);
            }
            else {
                regex = new RegExp("^" + globString.replace(/\*/g, '.*') + "$");
                regexMap.set(globString, regex);
            }
            return regex.test(targetString);
        }
        else {
            return globString === targetString;
        }
    }
    exports.isGlobMatch = isGlobMatch;
    /**
     * Event Class
     */
    var Evented = /** @class */ (function (_super) {
        tslib_1.__extends(Evented, _super);
        function Evented() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * map of listeners keyed by event type
             */
            _this.listenersMap = new Map_1.default();
            return _this;
        }
        Evented.prototype.emit = function (event) {
            var _this = this;
            this.listenersMap.forEach(function (methods, type) {
                if (isGlobMatch(type, event.type)) {
                    tslib_1.__spread(methods).forEach(function (method) {
                        method.call(_this, event);
                    });
                }
            });
        };
        Evented.prototype.on = function (type, listener) {
            var _this = this;
            if (Array.isArray(listener)) {
                var handles_1 = listener.map(function (listener) { return _this._addListener(type, listener); });
                return {
                    destroy: function () {
                        handles_1.forEach(function (handle) { return handle.destroy(); });
                    }
                };
            }
            return this._addListener(type, listener);
        };
        Evented.prototype._addListener = function (type, listener) {
            var _this = this;
            var listeners = this.listenersMap.get(type) || [];
            listeners.push(listener);
            this.listenersMap.set(type, listeners);
            return {
                destroy: function () {
                    var listeners = _this.listenersMap.get(type) || [];
                    listeners.splice(listeners.indexOf(listener), 1);
                }
            };
        };
        return Evented;
    }(Destroyable_1.Destroyable));
    exports.Evented = Evented;
    exports.default = Evented;
});
//# sourceMappingURL=Evented.js.map