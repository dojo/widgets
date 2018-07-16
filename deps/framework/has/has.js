(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isFeatureTestThenable(value) {
        return value && value.then;
    }
    /**
     * A cache of results of feature tests
     */
    exports.testCache = {};
    /**
     * A cache of the un-resolved feature tests
     */
    exports.testFunctions = {};
    /**
     * A cache of unresolved thenables (probably promises)
     * @type {{}}
     */
    var testThenables = {};
    /**
     * A reference to the global scope (`window` in a browser, `global` in NodeJS)
     */
    var globalScope = (function () {
        /* istanbul ignore else */
        if (typeof window !== 'undefined') {
            // Browsers
            return window;
        }
        else if (typeof global !== 'undefined') {
            // Node
            return global;
        }
        else if (typeof self !== 'undefined') {
            // Web workers
            return self;
        }
        /* istanbul ignore next */
        return {};
    })();
    /* Grab the staticFeatures if there are available */
    var staticFeatures = (globalScope.DojoHasEnvironment || {}).staticFeatures;
    /* Cleaning up the DojoHasEnviornment */
    if ('DojoHasEnvironment' in globalScope) {
        delete globalScope.DojoHasEnvironment;
    }
    /**
     * Custom type guard to narrow the `staticFeatures` to either a map or a function that
     * returns a map.
     *
     * @param value The value to guard for
     */
    function isStaticFeatureFunction(value) {
        return typeof value === 'function';
    }
    /**
     * The cache of asserted features that were available in the global scope when the
     * module loaded
     */
    var staticCache = staticFeatures
        ? isStaticFeatureFunction(staticFeatures) ? staticFeatures.apply(globalScope) : staticFeatures
        : {}; /* Providing an empty cache, if none was in the environment

/**
 * AMD plugin function.
 *
 * Conditional loads modules based on a has feature test value.
 *
 * @param resourceId Gives the resolved module id to load.
 * @param require The loader require function with respect to the module that contained the plugin resource in its
 *                dependency list.
 * @param load Callback to loader that consumes result of plugin demand.
 */
    function load(resourceId, require, load, config) {
        resourceId ? require([resourceId], load) : load();
    }
    exports.load = load;
    /**
     * AMD plugin function.
     *
     * Resolves resourceId into a module id based on possibly-nested tenary expression that branches on has feature test
     * value(s).
     *
     * @param resourceId The id of the module
     * @param normalize Resolves a relative module id into an absolute module id
     */
    function normalize(resourceId, normalize) {
        var tokens = resourceId.match(/[\?:]|[^:\?]*/g) || [];
        var i = 0;
        function get(skip) {
            var term = tokens[i++];
            if (term === ':') {
                // empty string module name, resolves to null
                return null;
            }
            else {
                // postfixed with a ? means it is a feature to branch on, the term is the name of the feature
                if (tokens[i++] === '?') {
                    if (!skip && has(term)) {
                        // matched the feature, get the first value from the options
                        return get();
                    }
                    else {
                        // did not match, get the second value, passing over the first
                        get(true);
                        return get(skip);
                    }
                }
                // a module
                return term;
            }
        }
        var id = get();
        return id && normalize(id);
    }
    exports.normalize = normalize;
    /**
     * Check if a feature has already been registered
     *
     * @param feature the name of the feature
     */
    function exists(feature) {
        var normalizedFeature = feature.toLowerCase();
        return Boolean(normalizedFeature in staticCache || normalizedFeature in exports.testCache || exports.testFunctions[normalizedFeature]);
    }
    exports.exists = exists;
    /**
     * Register a new test for a named feature.
     *
     * @example
     * has.add('dom-addeventlistener', !!document.addEventListener);
     *
     * @example
     * has.add('touch-events', function () {
     *    return 'ontouchstart' in document
     * });
     *
     * @param feature the name of the feature
     * @param value the value reported of the feature, or a function that will be executed once on first test
     * @param overwrite if an existing value should be overwritten. Defaults to false.
     */
    function add(feature, value, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        var normalizedFeature = feature.toLowerCase();
        if (exists(normalizedFeature) && !overwrite && !(normalizedFeature in staticCache)) {
            throw new TypeError("Feature \"" + feature + "\" exists and overwrite not true.");
        }
        if (typeof value === 'function') {
            exports.testFunctions[normalizedFeature] = value;
        }
        else if (isFeatureTestThenable(value)) {
            testThenables[feature] = value.then(function (resolvedValue) {
                exports.testCache[feature] = resolvedValue;
                delete testThenables[feature];
            }, function () {
                delete testThenables[feature];
            });
        }
        else {
            exports.testCache[normalizedFeature] = value;
            delete exports.testFunctions[normalizedFeature];
        }
    }
    exports.add = add;
    /**
     * Return the current value of a named feature.
     *
     * @param feature The name (if a string) or identifier (if an integer) of the feature to test.
     */
    function has(feature) {
        var result;
        var normalizedFeature = feature.toLowerCase();
        if (normalizedFeature in staticCache) {
            result = staticCache[normalizedFeature];
        }
        else if (exports.testFunctions[normalizedFeature]) {
            result = exports.testCache[normalizedFeature] = exports.testFunctions[normalizedFeature].call(null);
            delete exports.testFunctions[normalizedFeature];
        }
        else if (normalizedFeature in exports.testCache) {
            result = exports.testCache[normalizedFeature];
        }
        else if (feature in testThenables) {
            return false;
        }
        else {
            throw new TypeError("Attempt to detect unregistered has feature \"" + feature + "\"");
        }
        return result;
    }
    exports.default = has;
    /*
     * Out of the box feature tests
     */
    /* Environments */
    /* Used as a value to provide a debug only code path */
    add('debug', true);
    /* Detects if the environment is "browser like" */
    add('host-browser', typeof document !== 'undefined' && typeof location !== 'undefined');
    /* Detects if the environment appears to be NodeJS */
    add('host-node', function () {
        if (typeof process === 'object' && process.versions && process.versions.node) {
            return process.versions.node;
        }
    });
});
//# sourceMappingURL=has.js.map