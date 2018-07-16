(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    function decode(segment) {
        return segment.replace(/~1/g, '/').replace(/~0/g, '~');
    }
    exports.decode = decode;
    function encode(segment) {
        return segment.replace(/~/g, '~0').replace(/\//g, '~1');
    }
    function walk(segments, object, clone, continueOnUndefined) {
        if (clone === void 0) { clone = true; }
        if (continueOnUndefined === void 0) { continueOnUndefined = true; }
        if (clone) {
            object = tslib_1.__assign({}, object);
        }
        var pointerTarget = {
            object: object,
            target: object,
            segment: ''
        };
        return segments.reduce(function (pointerTarget, segment, index) {
            if (pointerTarget.target === undefined) {
                return pointerTarget;
            }
            if (Array.isArray(pointerTarget.target) && segment === '-') {
                segment = String(pointerTarget.target.length - 1);
            }
            if (index + 1 < segments.length) {
                var nextSegment = segments[index + 1];
                var target = pointerTarget.target[segment];
                if (target === undefined && !continueOnUndefined) {
                    pointerTarget.target = undefined;
                    return pointerTarget;
                }
                if (clone || target === undefined) {
                    if (Array.isArray(target)) {
                        target = tslib_1.__spread(target);
                    }
                    else if (typeof target === 'object') {
                        target = tslib_1.__assign({}, target);
                    }
                    else if (isNaN(parseInt(nextSegment, 0))) {
                        target = {};
                    }
                    else {
                        target = [];
                    }
                    pointerTarget.target[segment] = target;
                    pointerTarget.target = target;
                }
                else {
                    pointerTarget.target = target;
                }
            }
            else {
                pointerTarget.segment = segment;
            }
            return pointerTarget;
        }, pointerTarget);
    }
    exports.walk = walk;
    var Pointer = /** @class */ (function () {
        function Pointer(segments) {
            if (Array.isArray(segments)) {
                this._segments = segments;
            }
            else {
                this._segments = (segments[0] === '/' ? segments : "/" + segments).split('/');
                this._segments.shift();
            }
            if (segments.length === 0 || ((segments.length === 1 && segments[0] === '/') || segments[0] === '')) {
                throw new Error('Access to the root is not supported.');
            }
            this._segments = this._segments.map(decode);
        }
        Object.defineProperty(Pointer.prototype, "segments", {
            get: function () {
                return this._segments;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pointer.prototype, "path", {
            get: function () {
                return "/" + this._segments.map(encode).join('/');
            },
            enumerable: true,
            configurable: true
        });
        Pointer.prototype.get = function (object) {
            var pointerTarget = walk(this.segments, object, false, false);
            if (pointerTarget.target === undefined) {
                return undefined;
            }
            return pointerTarget.target[pointerTarget.segment];
        };
        Pointer.prototype.toJSON = function () {
            return this.toString();
        };
        Pointer.prototype.toString = function () {
            return this.path;
        };
        return Pointer;
    }());
    exports.Pointer = Pointer;
});
//# sourceMappingURL=Pointer.js.map