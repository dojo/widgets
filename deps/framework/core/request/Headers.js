(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../shim/iterator", "../../shim/Map"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var iterator_1 = require("../../shim/iterator");
    var Map_1 = require("../../shim/Map");
    function isHeadersLike(object) {
        return (typeof object.append === 'function' &&
            typeof object.entries === 'function' &&
            typeof object[Symbol.iterator] === 'function');
    }
    var Headers = /** @class */ (function () {
        function Headers(headers) {
            this.map = new Map_1.default();
            if (headers) {
                if (headers instanceof Headers) {
                    this.map = new Map_1.default(headers.map);
                }
                else if (isHeadersLike(headers)) {
                    try {
                        for (var headers_1 = tslib_1.__values(headers), headers_1_1 = headers_1.next(); !headers_1_1.done; headers_1_1 = headers_1.next()) {
                            var _a = tslib_1.__read(headers_1_1.value, 2), key = _a[0], value = _a[1];
                            this.append(key, value);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (headers_1_1 && !headers_1_1.done && (_b = headers_1.return)) _b.call(headers_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    for (var key in headers) {
                        this.set(key, headers[key]);
                    }
                }
            }
            var e_1, _b;
        }
        Headers.prototype.append = function (name, value) {
            var values = this.map.get(name.toLowerCase());
            if (values) {
                values.push(value);
            }
            else {
                this.set(name, value);
            }
        };
        Headers.prototype.delete = function (name) {
            this.map.delete(name.toLowerCase());
        };
        Headers.prototype.entries = function () {
            var entries = [];
            var _loop_1 = function (key, values) {
                values.forEach(function (value) {
                    entries.push([key, value]);
                });
            };
            try {
                for (var _a = tslib_1.__values(this.map.entries()), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var _c = tslib_1.__read(_b.value, 2), key = _c[0], values = _c[1];
                    _loop_1(key, values);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return new iterator_1.ShimIterator(entries);
            var e_2, _d;
        };
        Headers.prototype.get = function (name) {
            var values = this.map.get(name.toLowerCase());
            if (values) {
                return values[0];
            }
            else {
                return null;
            }
        };
        Headers.prototype.getAll = function (name) {
            var values = this.map.get(name.toLowerCase());
            if (values) {
                return values.slice(0);
            }
            else {
                return [];
            }
        };
        Headers.prototype.has = function (name) {
            return this.map.has(name.toLowerCase());
        };
        Headers.prototype.keys = function () {
            return this.map.keys();
        };
        Headers.prototype.set = function (name, value) {
            this.map.set(name.toLowerCase(), [value]);
        };
        Headers.prototype.values = function () {
            var values = [];
            try {
                for (var _a = tslib_1.__values(this.map.values()), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var value = _b.value;
                    values.push.apply(values, tslib_1.__spread(value));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return new iterator_1.ShimIterator(values);
            var e_3, _c;
        };
        Headers.prototype[Symbol.iterator] = function () {
            return this.entries();
        };
        return Headers;
    }());
    exports.Headers = Headers;
    exports.default = Headers;
});
//# sourceMappingURL=Headers.js.map