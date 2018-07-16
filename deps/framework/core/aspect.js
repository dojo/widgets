(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../shim/WeakMap", "./lang"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WeakMap_1 = require("../shim/WeakMap");
    var lang_1 = require("./lang");
    /**
     * An internal type guard that determines if an value is MapLike or not
     *
     * @param value The value to guard against
     */
    function isMapLike(value) {
        return value && typeof value.get === 'function' && typeof value.set === 'function';
    }
    /**
     * A weak map of dispatchers used to apply the advice
     */
    var dispatchAdviceMap = new WeakMap_1.default();
    /**
     * A UID for tracking advice ordering
     */
    var nextId = 0;
    /**
     * Internal function that advises a join point
     *
     * @param dispatcher The current advice dispatcher
     * @param type The type of before or after advice to apply
     * @param advice The advice to apply
     * @param receiveArguments If true, the advice will receive the arguments passed to the join point
     * @return The handle that will remove the advice
     */
    function adviseObject(dispatcher, type, advice, receiveArguments) {
        var previous = dispatcher && dispatcher[type];
        var advised = {
            id: nextId++,
            advice: advice,
            receiveArguments: receiveArguments
        };
        if (previous) {
            if (type === 'after') {
                // add the listener to the end of the list
                // note that we had to change this loop a little bit to workaround a bizarre IE10 JIT bug
                while (previous.next && (previous = previous.next)) { }
                previous.next = advised;
                advised.previous = previous;
            }
            else {
                // add to the beginning
                if (dispatcher) {
                    dispatcher.before = advised;
                }
                advised.next = previous;
                previous.previous = advised;
            }
        }
        else {
            dispatcher && (dispatcher[type] = advised);
        }
        advice = previous = undefined;
        return lang_1.createHandle(function () {
            var _a = advised || {}, _b = _a.previous, previous = _b === void 0 ? undefined : _b, _c = _a.next, next = _c === void 0 ? undefined : _c;
            if (dispatcher && !previous && !next) {
                dispatcher[type] = undefined;
            }
            else {
                if (previous) {
                    previous.next = next;
                }
                else {
                    dispatcher && (dispatcher[type] = next);
                }
                if (next) {
                    next.previous = previous;
                }
            }
            if (advised) {
                delete advised.advice;
            }
            dispatcher = advised = undefined;
        });
    }
    /**
     * Advise a join point (function) with supplied advice
     *
     * @param joinPoint The function to be advised
     * @param type The type of advice to be applied
     * @param advice The advice to apply
     */
    function adviseJoinPoint(joinPoint, type, advice) {
        var dispatcher;
        if (type === 'around') {
            dispatcher = getJoinPointDispatcher(advice.apply(this, [joinPoint]));
        }
        else {
            dispatcher = getJoinPointDispatcher(joinPoint);
            // cannot have undefined in map due to code logic, using !
            var adviceMap = dispatchAdviceMap.get(dispatcher);
            if (type === 'before') {
                (adviceMap.before || (adviceMap.before = [])).unshift(advice);
            }
            else {
                (adviceMap.after || (adviceMap.after = [])).push(advice);
            }
        }
        return dispatcher;
    }
    /**
     * An internal function that resolves or creates the dispatcher for a given join point
     *
     * @param target The target object or map
     * @param methodName The name of the method that the dispatcher should be resolved for
     * @return The dispatcher
     */
    function getDispatcherObject(target, methodName) {
        var existing = isMapLike(target) ? target.get(methodName) : target && target[methodName];
        var dispatcher;
        if (!existing || existing.target !== target) {
            /* There is no existing dispatcher, therefore we will create one */
            dispatcher = function () {
                var executionId = nextId;
                var args = arguments;
                var results;
                var before = dispatcher.before;
                while (before) {
                    if (before.advice) {
                        args = before.advice.apply(this, args) || args;
                    }
                    before = before.next;
                }
                if (dispatcher.around && dispatcher.around.advice) {
                    results = dispatcher.around.advice(this, args);
                }
                var after = dispatcher.after;
                while (after && after.id !== undefined && after.id < executionId) {
                    if (after.advice) {
                        if (after.receiveArguments) {
                            var newResults = after.advice.apply(this, args);
                            results = newResults === undefined ? results : newResults;
                        }
                        else {
                            results = after.advice.call(this, results, args);
                        }
                    }
                    after = after.next;
                }
                return results;
            };
            if (isMapLike(target)) {
                target.set(methodName, dispatcher);
            }
            else {
                target && (target[methodName] = dispatcher);
            }
            if (existing) {
                dispatcher.around = {
                    advice: function (target, args) {
                        return existing.apply(target, args);
                    }
                };
            }
            dispatcher.target = target;
        }
        else {
            dispatcher = existing;
        }
        return dispatcher;
    }
    /**
     * Returns the dispatcher function for a given joinPoint (method/function)
     *
     * @param joinPoint The function that is to be advised
     */
    function getJoinPointDispatcher(joinPoint) {
        function dispatcher() {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // cannot have undefined in map due to code logic, using !
            var _a = dispatchAdviceMap.get(dispatcher), before = _a.before, after = _a.after, joinPoint = _a.joinPoint;
            if (before) {
                args = before.reduce(function (previousArgs, advice) {
                    var currentArgs = advice.apply(_this, previousArgs);
                    return currentArgs || previousArgs;
                }, args);
            }
            var result = joinPoint.apply(this, args);
            if (after) {
                result = after.reduce(function (previousResult, advice) {
                    return advice.apply(_this, [previousResult].concat(args));
                }, result);
            }
            return result;
        }
        /* We want to "clone" the advice that has been applied already, if this
         * joinPoint is already advised */
        if (dispatchAdviceMap.has(joinPoint)) {
            // cannot have undefined in map due to code logic, using !
            var adviceMap = dispatchAdviceMap.get(joinPoint);
            var before_1 = adviceMap.before, after_1 = adviceMap.after;
            if (before_1) {
                before_1 = before_1.slice(0);
            }
            if (after_1) {
                after_1 = after_1.slice(0);
            }
            dispatchAdviceMap.set(dispatcher, {
                joinPoint: adviceMap.joinPoint,
                before: before_1,
                after: after_1
            });
        }
        else {
            /* Otherwise, this is a new joinPoint, so we will create the advice map afresh */
            dispatchAdviceMap.set(dispatcher, { joinPoint: joinPoint });
        }
        return dispatcher;
    }
    /**
     * Apply advice *after* the supplied joinPoint (function)
     *
     * @param joinPoint A function that should have advice applied to
     * @param advice The after advice
     */
    function afterJoinPoint(joinPoint, advice) {
        return adviseJoinPoint(joinPoint, 'after', advice);
    }
    /**
     * Attaches "after" advice to be executed after the original method.
     * The advising function will receive the original method's return value and arguments object.
     * The value it returns will be returned from the method when it is called (even if the return value is undefined).
     *
     * @param target Object whose method will be aspected
     * @param methodName Name of method to aspect
     * @param advice Advising function which will receive the original method's return value and arguments object
     * @return A handle which will remove the aspect when destroy is called
     */
    function afterObject(target, methodName, advice) {
        return adviseObject(getDispatcherObject(target, methodName), 'after', advice);
    }
    function after(joinPointOrTarget, methodNameOrAdvice, objectAdvice) {
        if (typeof joinPointOrTarget === 'function') {
            return afterJoinPoint(joinPointOrTarget, methodNameOrAdvice);
        }
        else {
            return afterObject(joinPointOrTarget, methodNameOrAdvice, objectAdvice);
        }
    }
    exports.after = after;
    /**
     * Apply advice *around* the supplied joinPoint (function)
     *
     * @param joinPoint A function that should have advice applied to
     * @param advice The around advice
     */
    function aroundJoinPoint(joinPoint, advice) {
        return adviseJoinPoint(joinPoint, 'around', advice);
    }
    exports.aroundJoinPoint = aroundJoinPoint;
    /**
     * Attaches "around" advice around the original method.
     *
     * @param target Object whose method will be aspected
     * @param methodName Name of method to aspect
     * @param advice Advising function which will receive the original function
     * @return A handle which will remove the aspect when destroy is called
     */
    function aroundObject(target, methodName, advice) {
        var dispatcher = getDispatcherObject(target, methodName);
        var previous = dispatcher.around;
        var advised;
        if (advice) {
            advised = advice(function () {
                if (previous && previous.advice) {
                    return previous.advice(this, arguments);
                }
            });
        }
        dispatcher.around = {
            advice: function (target, args) {
                return advised ? advised.apply(target, args) : previous && previous.advice && previous.advice(target, args);
            }
        };
        return lang_1.createHandle(function () {
            advised = dispatcher = undefined;
        });
    }
    exports.aroundObject = aroundObject;
    function around(joinPointOrTarget, methodNameOrAdvice, objectAdvice) {
        if (typeof joinPointOrTarget === 'function') {
            return aroundJoinPoint(joinPointOrTarget, methodNameOrAdvice);
        }
        else {
            return aroundObject(joinPointOrTarget, methodNameOrAdvice, objectAdvice);
        }
    }
    exports.around = around;
    /**
     * Apply advice *before* the supplied joinPoint (function)
     *
     * @param joinPoint A function that should have advice applied to
     * @param advice The before advice
     */
    function beforeJoinPoint(joinPoint, advice) {
        return adviseJoinPoint(joinPoint, 'before', advice);
    }
    exports.beforeJoinPoint = beforeJoinPoint;
    /**
     * Attaches "before" advice to be executed before the original method.
     *
     * @param target Object whose method will be aspected
     * @param methodName Name of method to aspect
     * @param advice Advising function which will receive the same arguments as the original, and may return new arguments
     * @return A handle which will remove the aspect when destroy is called
     */
    function beforeObject(target, methodName, advice) {
        return adviseObject(getDispatcherObject(target, methodName), 'before', advice);
    }
    exports.beforeObject = beforeObject;
    function before(joinPointOrTarget, methodNameOrAdvice, objectAdvice) {
        if (typeof joinPointOrTarget === 'function') {
            return beforeJoinPoint(joinPointOrTarget, methodNameOrAdvice);
        }
        else {
            return beforeObject(joinPointOrTarget, methodNameOrAdvice, objectAdvice);
        }
    }
    exports.before = before;
    /**
     * Attaches advice to be executed after the original method.
     * The advising function will receive the same arguments as the original method.
     * The value it returns will be returned from the method when it is called *unless* its return value is undefined.
     *
     * @param target Object whose method will be aspected
     * @param methodName Name of method to aspect
     * @param advice Advising function which will receive the same arguments as the original method
     * @return A handle which will remove the aspect when destroy is called
     */
    function on(target, methodName, advice) {
        return adviseObject(getDispatcherObject(target, methodName), 'after', advice, true);
    }
    exports.on = on;
});
//# sourceMappingURL=aspect.js.map