(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../shim/array", "../../shim/iterator", "../../shim/Promise"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var array = require("../../shim/array");
    var iterator_1 = require("../../shim/iterator");
    var Promise_1 = require("../../shim/Promise");
    function isThenable(value) {
        return value && typeof value.then === 'function';
    }
    /**
     * Processes all items and then applies the callback to each item and eventually returns an object containing the
     * processed values and callback results
     * @param items a list of synchronous/asynchronous values to process
     * @param callback a callback that maps values to synchronous/asynchronous results
     * @return a list of objects holding the synchronous values and synchronous results.
     */
    function processValuesAndCallback(items, callback) {
        return Promise_1.default.all(items).then(function (results) {
            var pass = Array.prototype.map.call(results, callback);
            return Promise_1.default.all(pass).then(function (pass) {
                return { values: results, results: pass };
            });
        });
    }
    /**
     * Finds the index of the next value in a sparse array-like object
     * @param list the sparse array-like object
     * @param offset the starting offset
     * @return the offset of the next index with a value; or -1 if not found
     */
    function findNextValueIndex(list, offset) {
        if (offset === void 0) { offset = -1; }
        offset++;
        for (var length_1 = list.length; offset < length_1; offset++) {
            if (offset in list) {
                return offset;
            }
        }
        return -1;
    }
    function findLastValueIndex(list, offset) {
        offset = (offset === undefined ? list.length : offset) - 1;
        for (; offset >= 0; offset--) {
            if (offset in list) {
                return offset;
            }
        }
        return -1;
    }
    function generalReduce(findNextIndex, items, callback, initialValue) {
        var hasInitialValue = arguments.length > 3;
        return Promise_1.default.all(items).then(function (results) {
            return new Promise_1.default(function (resolve, reject) {
                // As iterators do not have indices like `ArrayLike` objects, the results array
                // is used to determine the next value.
                var list = iterator_1.isArrayLike(items) ? items : results;
                var i;
                function next(currentValue) {
                    i = findNextIndex(list, i);
                    if (i >= 0) {
                        if (results) {
                            if (currentValue) {
                                var result = callback(currentValue, results[i], i, results);
                                if (isThenable(result)) {
                                    result.then(next, reject);
                                }
                                else {
                                    next(result);
                                }
                            }
                        }
                    }
                    else {
                        resolve(currentValue);
                    }
                }
                var value;
                if (hasInitialValue) {
                    value = initialValue;
                }
                else {
                    i = findNextIndex(list);
                    if (i < 0) {
                        throw new Error('reduce array with no initial value');
                    }
                    if (results) {
                        value = results[i];
                    }
                }
                next(value);
            });
        });
    }
    function testAndHaltOnCondition(condition, items, callback) {
        return Promise_1.default.all(items).then(function (results) {
            return new Promise_1.default(function (resolve) {
                var result;
                var pendingCount = 0;
                if (results) {
                    for (var i = 0; i < results.length; i++) {
                        result = callback(results[i], i, results);
                        if (result === condition) {
                            return resolve(result);
                        }
                        else if (isThenable(result)) {
                            pendingCount++;
                            result.then(function (result) {
                                if (result === condition) {
                                    resolve(result);
                                }
                                pendingCount--;
                                if (pendingCount === 0) {
                                    resolve(!condition);
                                }
                            });
                        }
                    }
                }
                if (pendingCount === 0) {
                    resolve(!condition);
                }
            });
        });
    }
    /**
     * Test whether all elements in the array pass the provided callback
     * @param items a collection of synchronous/asynchronous values
     * @param callback a synchronous/asynchronous test
     * @return eventually returns true if all values pass; otherwise false
     */
    function every(items, callback) {
        return testAndHaltOnCondition(false, items, callback);
    }
    exports.every = every;
    /**
     * Returns an array of elements which pass the provided callback
     * @param items a collection of synchronous/asynchronous values
     * @param callback a synchronous/asynchronous test
     * @return eventually returns a new array with only values that have passed
     */
    function filter(items, callback) {
        return processValuesAndCallback(items, callback).then(function (result) {
            var arr = [];
            if (result && result.results && result.values) {
                for (var i = 0; i < result.results.length; i++) {
                    result.results[i] && arr.push(result.values[i]);
                }
            }
            return arr;
        });
    }
    exports.filter = filter;
    /**
     * Find the first value matching a filter function
     * @param items a collection of synchronous/asynchronous values
     * @param callback a synchronous/asynchronous test
     * @return a promise eventually containing the item or undefined if a match is not found
     */
    function find(items, callback) {
        var list = iterator_1.isArrayLike(items) ? items : array.from(items);
        return findIndex(list, callback).then(function (i) {
            return i !== undefined && i >= 0 ? list[i] : undefined;
        });
    }
    exports.find = find;
    /**
     * Find the first index with a value matching the filter function
     * @param items a collection of synchronous/asynchronous values
     * @param callback a synchronous/asynchronous test
     * @return a promise eventually containing the index of the matching item or -1 if a match is not found
     */
    function findIndex(items, callback) {
        // TODO we can improve this by returning immediately
        return processValuesAndCallback(items, callback).then(function (result) {
            if (result && result.results) {
                for (var i = 0; i < result.results.length; i++) {
                    if (result.results[i]) {
                        return i;
                    }
                }
            }
            return -1;
        });
    }
    exports.findIndex = findIndex;
    /**
     * transform a list of items using a mapper function
     * @param items a collection of synchronous/asynchronous values
     * @param callback a synchronous/asynchronous transform function
     * @return a promise eventually containing a collection of each transformed value
     */
    function map(items, callback) {
        return processValuesAndCallback(items, callback).then(function (result) {
            return result ? result.results : null;
        });
    }
    exports.map = map;
    /**
     * reduce a list of items down to a single value
     * @param items a collection of synchronous/asynchronous values
     * @param callback a synchronous/asynchronous reducer function
     * @param [initialValue] the first value to pass to the callback
     * @return a promise eventually containing a value that is the result of the reduction
     */
    function reduce(items, callback, initialValue) {
        var args = array.from(arguments);
        args.unshift(findNextValueIndex);
        return generalReduce.apply(this, args);
    }
    exports.reduce = reduce;
    function reduceRight(items, callback, initialValue) {
        var args = array.from(arguments);
        args.unshift(findLastValueIndex);
        return generalReduce.apply(this, args);
    }
    exports.reduceRight = reduceRight;
    function series(items, operation) {
        return generalReduce(findNextValueIndex, items, function (previousValue, currentValue, index, array) {
            var result = operation(currentValue, index, array);
            if (isThenable(result)) {
                return result.then(function (value) {
                    previousValue.push(value);
                    return previousValue;
                });
            }
            previousValue.push(result);
            return previousValue;
        }, []);
    }
    exports.series = series;
    function some(items, callback) {
        return testAndHaltOnCondition(true, items, callback);
    }
    exports.some = some;
});
//# sourceMappingURL=iteration.js.map