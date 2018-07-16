(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/object", "../shim/object"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var object_1 = require("../shim/object");
    var object_2 = require("../shim/object");
    exports.assign = object_2.assign;
    var slice = Array.prototype.slice;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    /**
     * Type guard that ensures that the value can be coerced to Object
     * to weed out host objects that do not derive from Object.
     * This function is used to check if we want to deep copy an object or not.
     * Note: In ES6 it is possible to modify an object's Symbol.toStringTag property, which will
     * change the value returned by `toString`. This is a rare edge case that is difficult to handle,
     * so it is not handled here.
     * @param  value The value to check
     * @return       If the value is coercible into an Object
     */
    function shouldDeepCopyObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }
    function copyArray(array, inherited) {
        return array.map(function (item) {
            if (Array.isArray(item)) {
                return copyArray(item, inherited);
            }
            return !shouldDeepCopyObject(item)
                ? item
                : _mixin({
                    deep: true,
                    inherited: inherited,
                    sources: [item],
                    target: {}
                });
        });
    }
    function _mixin(kwArgs) {
        var deep = kwArgs.deep;
        var inherited = kwArgs.inherited;
        var target = kwArgs.target;
        var copied = kwArgs.copied || [];
        var copiedClone = tslib_1.__spread(copied);
        for (var i = 0; i < kwArgs.sources.length; i++) {
            var source = kwArgs.sources[i];
            if (source === null || source === undefined) {
                continue;
            }
            for (var key in source) {
                if (inherited || hasOwnProperty.call(source, key)) {
                    var value = source[key];
                    if (copiedClone.indexOf(value) !== -1) {
                        continue;
                    }
                    if (deep) {
                        if (Array.isArray(value)) {
                            value = copyArray(value, inherited);
                        }
                        else if (shouldDeepCopyObject(value)) {
                            var targetValue = target[key] || {};
                            copied.push(source);
                            value = _mixin({
                                deep: true,
                                inherited: inherited,
                                sources: [value],
                                target: targetValue,
                                copied: copied
                            });
                        }
                    }
                    target[key] = value;
                }
            }
        }
        return target;
    }
    function create(prototype) {
        var mixins = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            mixins[_i - 1] = arguments[_i];
        }
        if (!mixins.length) {
            throw new RangeError('lang.create requires at least one mixin object.');
        }
        var args = mixins.slice();
        args.unshift(Object.create(prototype));
        return object_1.assign.apply(null, args);
    }
    exports.create = create;
    function deepAssign(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        return _mixin({
            deep: true,
            inherited: false,
            sources: sources,
            target: target
        });
    }
    exports.deepAssign = deepAssign;
    function deepMixin(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        return _mixin({
            deep: true,
            inherited: true,
            sources: sources,
            target: target
        });
    }
    exports.deepMixin = deepMixin;
    /**
     * Creates a new object using the provided source's prototype as the prototype for the new object, and then
     * deep copies the provided source's values into the new target.
     *
     * @param source The object to duplicate
     * @return The new object
     */
    function duplicate(source) {
        var target = Object.create(Object.getPrototypeOf(source));
        return deepMixin(target, source);
    }
    exports.duplicate = duplicate;
    /**
     * Determines whether two values are the same value.
     *
     * @param a First value to compare
     * @param b Second value to compare
     * @return true if the values are the same; false otherwise
     */
    function isIdentical(a, b) {
        return (a === b ||
            /* both values are NaN */
            (a !== a && b !== b));
    }
    exports.isIdentical = isIdentical;
    /**
     * Returns a function that binds a method to the specified object at runtime. This is similar to
     * `Function.prototype.bind`, but instead of a function it takes the name of a method on an object.
     * As a result, the function returned by `lateBind` will always call the function currently assigned to
     * the specified property on the object as of the moment the function it returns is called.
     *
     * @param instance The context object
     * @param method The name of the method on the context object to bind to itself
     * @param suppliedArgs An optional array of values to prepend to the `instance[method]` arguments list
     * @return The bound function
     */
    function lateBind(instance, method) {
        var suppliedArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            suppliedArgs[_i - 2] = arguments[_i];
        }
        return suppliedArgs.length
            ? function () {
                var args = arguments.length ? suppliedArgs.concat(slice.call(arguments)) : suppliedArgs;
                // TS7017
                return instance[method].apply(instance, args);
            }
            : function () {
                // TS7017
                return instance[method].apply(instance, arguments);
            };
    }
    exports.lateBind = lateBind;
    function mixin(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        return _mixin({
            deep: false,
            inherited: true,
            sources: sources,
            target: target
        });
    }
    exports.mixin = mixin;
    /**
     * Returns a function which invokes the given function with the given arguments prepended to its argument list.
     * Like `Function.prototype.bind`, but does not alter execution context.
     *
     * @param targetFunction The function that needs to be bound
     * @param suppliedArgs An optional array of arguments to prepend to the `targetFunction` arguments list
     * @return The bound function
     */
    function partial(targetFunction) {
        var suppliedArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            suppliedArgs[_i - 1] = arguments[_i];
        }
        return function () {
            var args = arguments.length ? suppliedArgs.concat(slice.call(arguments)) : suppliedArgs;
            return targetFunction.apply(this, args);
        };
    }
    exports.partial = partial;
    /**
     * Returns an object with a destroy method that, when called, calls the passed-in destructor.
     * This is intended to provide a unified interface for creating "remove" / "destroy" handlers for
     * event listeners, timers, etc.
     *
     * @param destructor A function that will be called when the handle's `destroy` method is invoked
     * @return The handle object
     */
    function createHandle(destructor) {
        var called = false;
        return {
            destroy: function () {
                if (!called) {
                    called = true;
                    destructor();
                }
            }
        };
    }
    exports.createHandle = createHandle;
    /**
     * Returns a single handle that can be used to destroy multiple handles simultaneously.
     *
     * @param handles An array of handles with `destroy` methods
     * @return The handle object
     */
    function createCompositeHandle() {
        var handles = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            handles[_i] = arguments[_i];
        }
        return createHandle(function () {
            for (var i = 0; i < handles.length; i++) {
                handles[i].destroy();
            }
        });
    }
    exports.createCompositeHandle = createCompositeHandle;
});
//# sourceMappingURL=lang.js.map