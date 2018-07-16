(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../has/has", "../global", "../../has/has"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var has_1 = require("../../has/has");
    var global_1 = require("../global");
    exports.default = has_1.default;
    tslib_1.__exportStar(require("../../has/has"), exports);
    /* ECMAScript 6 and 7 Features */
    /* Array */
    has_1.add('es6-array', function () {
        return (['from', 'of'].every(function (key) { return key in global_1.default.Array; }) &&
            ['findIndex', 'find', 'copyWithin'].every(function (key) { return key in global_1.default.Array.prototype; }));
    }, true);
    has_1.add('es6-array-fill', function () {
        if ('fill' in global_1.default.Array.prototype) {
            /* Some versions of Safari do not properly implement this */
            return [1].fill(9, Number.POSITIVE_INFINITY)[0] === 1;
        }
        return false;
    }, true);
    has_1.add('es7-array', function () { return 'includes' in global_1.default.Array.prototype; }, true);
    /* Map */
    has_1.add('es6-map', function () {
        if (typeof global_1.default.Map === 'function') {
            /*
        IE11 and older versions of Safari are missing critical ES6 Map functionality
        We wrap this in a try/catch because sometimes the Map constructor exists, but does not
        take arguments (iOS 8.4)
         */
            try {
                var map = new global_1.default.Map([[0, 1]]);
                return (map.has(0) &&
                    typeof map.keys === 'function' &&
                    has_1.default('es6-symbol') &&
                    typeof map.values === 'function' &&
                    typeof map.entries === 'function');
            }
            catch (e) {
                /* istanbul ignore next: not testing on iOS at the moment */
                return false;
            }
        }
        return false;
    }, true);
    /* Math */
    has_1.add('es6-math', function () {
        return [
            'clz32',
            'sign',
            'log10',
            'log2',
            'log1p',
            'expm1',
            'cosh',
            'sinh',
            'tanh',
            'acosh',
            'asinh',
            'atanh',
            'trunc',
            'fround',
            'cbrt',
            'hypot'
        ].every(function (name) { return typeof global_1.default.Math[name] === 'function'; });
    }, true);
    has_1.add('es6-math-imul', function () {
        if ('imul' in global_1.default.Math) {
            /* Some versions of Safari on ios do not properly implement this */
            return Math.imul(0xffffffff, 5) === -5;
        }
        return false;
    }, true);
    /* Object */
    has_1.add('es6-object', function () {
        return (has_1.default('es6-symbol') &&
            ['assign', 'is', 'getOwnPropertySymbols', 'setPrototypeOf'].every(function (name) { return typeof global_1.default.Object[name] === 'function'; }));
    }, true);
    has_1.add('es2017-object', function () {
        return ['values', 'entries', 'getOwnPropertyDescriptors'].every(function (name) { return typeof global_1.default.Object[name] === 'function'; });
    }, true);
    /* Observable */
    has_1.add('es-observable', function () { return typeof global_1.default.Observable !== 'undefined'; }, true);
    /* Promise */
    has_1.add('es6-promise', function () { return typeof global_1.default.Promise !== 'undefined' && has_1.default('es6-symbol'); }, true);
    /* Set */
    has_1.add('es6-set', function () {
        if (typeof global_1.default.Set === 'function') {
            /* IE11 and older versions of Safari are missing critical ES6 Set functionality */
            var set = new global_1.default.Set([1]);
            return set.has(1) && 'keys' in set && typeof set.keys === 'function' && has_1.default('es6-symbol');
        }
        return false;
    }, true);
    /* String */
    has_1.add('es6-string', function () {
        return ([
            /* static methods */
            'fromCodePoint'
        ].every(function (key) { return typeof global_1.default.String[key] === 'function'; }) &&
            [
                /* instance methods */
                'codePointAt',
                'normalize',
                'repeat',
                'startsWith',
                'endsWith',
                'includes'
            ].every(function (key) { return typeof global_1.default.String.prototype[key] === 'function'; }));
    }, true);
    has_1.add('es6-string-raw', function () {
        function getCallSite(callSite) {
            var substitutions = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                substitutions[_i - 1] = arguments[_i];
            }
            var result = tslib_1.__spread(callSite);
            result.raw = callSite.raw;
            return result;
        }
        if ('raw' in global_1.default.String) {
            var b = 1;
            var callSite = getCallSite(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["a\n", ""], ["a\\n", ""])), b);
            callSite.raw = ['a\\n'];
            var supportsTrunc = global_1.default.String.raw(callSite, 42) === 'a:\\n';
            return supportsTrunc;
        }
        return false;
    }, true);
    has_1.add('es2017-string', function () {
        return ['padStart', 'padEnd'].every(function (key) { return typeof global_1.default.String.prototype[key] === 'function'; });
    }, true);
    /* Symbol */
    has_1.add('es6-symbol', function () { return typeof global_1.default.Symbol !== 'undefined' && typeof Symbol() === 'symbol'; }, true);
    /* WeakMap */
    has_1.add('es6-weakmap', function () {
        if (typeof global_1.default.WeakMap !== 'undefined') {
            /* IE11 and older versions of Safari are missing critical ES6 Map functionality */
            var key1 = {};
            var key2 = {};
            var map = new global_1.default.WeakMap([[key1, 1]]);
            Object.freeze(key1);
            return map.get(key1) === 1 && map.set(key2, 2) === map && has_1.default('es6-symbol');
        }
        return false;
    }, true);
    /* Miscellaneous features */
    has_1.add('microtasks', function () { return has_1.default('es6-promise') || has_1.default('host-node') || has_1.default('dom-mutationobserver'); }, true);
    has_1.add('postmessage', function () {
        // If window is undefined, and we have postMessage, it probably means we're in a web worker. Web workers have
        // post message but it doesn't work how we expect it to, so it's best just to pretend it doesn't exist.
        return typeof global_1.default.window !== 'undefined' && typeof global_1.default.postMessage === 'function';
    }, true);
    has_1.add('raf', function () { return typeof global_1.default.requestAnimationFrame === 'function'; }, true);
    has_1.add('setimmediate', function () { return typeof global_1.default.setImmediate !== 'undefined'; }, true);
    /* DOM Features */
    has_1.add('dom-mutationobserver', function () {
        if (has_1.default('host-browser') && Boolean(global_1.default.MutationObserver || global_1.default.WebKitMutationObserver)) {
            // IE11 has an unreliable MutationObserver implementation where setProperty() does not
            // generate a mutation event, observers can crash, and the queue does not drain
            // reliably. The following feature test was adapted from
            // https://gist.github.com/t10ko/4aceb8c71681fdb275e33efe5e576b14
            var example = document.createElement('div');
            /* tslint:disable-next-line:variable-name */
            var HostMutationObserver = global_1.default.MutationObserver || global_1.default.WebKitMutationObserver;
            var observer = new HostMutationObserver(function () { });
            observer.observe(example, { attributes: true });
            example.style.setProperty('display', 'block');
            return Boolean(observer.takeRecords().length);
        }
        return false;
    }, true);
    has_1.add('dom-webanimation', function () { return has_1.default('host-browser') && global_1.default.Animation !== undefined && global_1.default.KeyframeEffect !== undefined; }, true);
    var templateObject_1;
});
//# sourceMappingURL=has.js.map