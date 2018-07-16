import * as array from '../../shim/array';
import { isArrayLike } from '../../shim/iterator';
import Promise from '../../shim/Promise';
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
    return Promise.all(items).then(function (results) {
        const pass = Array.prototype.map.call(results, callback);
        return Promise.all(pass).then(function (pass) {
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
function findNextValueIndex(list, offset = -1) {
    offset++;
    for (let length = list.length; offset < length; offset++) {
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
    const hasInitialValue = arguments.length > 3;
    return Promise.all(items).then(function (results) {
        return new Promise(function (resolve, reject) {
            // As iterators do not have indices like `ArrayLike` objects, the results array
            // is used to determine the next value.
            const list = isArrayLike(items) ? items : results;
            let i;
            function next(currentValue) {
                i = findNextIndex(list, i);
                if (i >= 0) {
                    if (results) {
                        if (currentValue) {
                            const result = callback(currentValue, results[i], i, results);
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
            let value;
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
    return Promise.all(items).then(function (results) {
        return new Promise(function (resolve) {
            let result;
            let pendingCount = 0;
            if (results) {
                for (let i = 0; i < results.length; i++) {
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
export function every(items, callback) {
    return testAndHaltOnCondition(false, items, callback);
}
/**
 * Returns an array of elements which pass the provided callback
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous test
 * @return eventually returns a new array with only values that have passed
 */
export function filter(items, callback) {
    return processValuesAndCallback(items, callback).then(function (result) {
        let arr = [];
        if (result && result.results && result.values) {
            for (let i = 0; i < result.results.length; i++) {
                result.results[i] && arr.push(result.values[i]);
            }
        }
        return arr;
    });
}
/**
 * Find the first value matching a filter function
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous test
 * @return a promise eventually containing the item or undefined if a match is not found
 */
export function find(items, callback) {
    const list = isArrayLike(items) ? items : array.from(items);
    return findIndex(list, callback).then(function (i) {
        return i !== undefined && i >= 0 ? list[i] : undefined;
    });
}
/**
 * Find the first index with a value matching the filter function
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous test
 * @return a promise eventually containing the index of the matching item or -1 if a match is not found
 */
export function findIndex(items, callback) {
    // TODO we can improve this by returning immediately
    return processValuesAndCallback(items, callback).then(function (result) {
        if (result && result.results) {
            for (let i = 0; i < result.results.length; i++) {
                if (result.results[i]) {
                    return i;
                }
            }
        }
        return -1;
    });
}
/**
 * transform a list of items using a mapper function
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous transform function
 * @return a promise eventually containing a collection of each transformed value
 */
export function map(items, callback) {
    return processValuesAndCallback(items, callback).then(function (result) {
        return result ? result.results : null;
    });
}
/**
 * reduce a list of items down to a single value
 * @param items a collection of synchronous/asynchronous values
 * @param callback a synchronous/asynchronous reducer function
 * @param [initialValue] the first value to pass to the callback
 * @return a promise eventually containing a value that is the result of the reduction
 */
export function reduce(items, callback, initialValue) {
    const args = array.from(arguments);
    args.unshift(findNextValueIndex);
    return generalReduce.apply(this, args);
}
export function reduceRight(items, callback, initialValue) {
    const args = array.from(arguments);
    args.unshift(findLastValueIndex);
    return generalReduce.apply(this, args);
}
export function series(items, operation) {
    return generalReduce(findNextValueIndex, items, function (previousValue, currentValue, index, array) {
        const result = operation(currentValue, index, array);
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
export function some(items, callback) {
    return testAndHaltOnCondition(true, items, callback);
}
//# sourceMappingURL=iteration.mjs.map