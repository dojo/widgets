(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../shim/object", "../shim/object", "../shim/Set"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var object_1 = require("../shim/object");
    var object_2 = require("../shim/object");
    var Set_1 = require("../shim/Set");
    /* Assigning to local variables to improve minification and readability */
    var objectCreate = Object.create;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var defineProperty = Object.defineProperty;
    var isArray = Array.isArray;
    var isFrozen = Object.isFrozen;
    var isSealed = Object.isSealed;
    /**
     * A record that describes how to instantiate a new object via a constructor function
     * @param Ctor The constructor function
     * @param args Any arguments to be passed to the constructor function
     */
    /* tslint:disable:variable-name */
    function createConstructRecord(Ctor, args, descriptor) {
        var record = object_1.assign(objectCreate(null), { Ctor: Ctor });
        if (args) {
            record.args = args;
        }
        if (descriptor) {
            record.descriptor = descriptor;
        }
        return record;
    }
    exports.createConstructRecord = createConstructRecord;
    /* tslint:enable:variable-name */
    /**
     * An internal function that returns a new patch record
     *
     * @param type The type of patch record
     * @param name The property name the record refers to
     * @param descriptor The property descriptor to be installed on the object
     * @param valueRecords Any subsequenet patch recrds to be applied to the value of the descriptor
     */
    function createPatchRecord(type, name, descriptor, valueRecords) {
        var patchRecord = object_1.assign(objectCreate(null), {
            type: type,
            name: name
        });
        if (descriptor) {
            patchRecord.descriptor = descriptor;
        }
        if (valueRecords) {
            patchRecord.valueRecords = valueRecords;
        }
        return patchRecord;
    }
    /**
     * An internal function that returns a new splice record
     *
     * @param start Where in the array to start the splice
     * @param deleteCount The number of elements to delete from the array
     * @param add Elements to be added to the target
     */
    function createSpliceRecord(start, deleteCount, add) {
        var spliceRecord = object_1.assign(objectCreate(null), {
            type: 'splice',
            start: start,
            deleteCount: deleteCount
        });
        if (add && add.length) {
            spliceRecord.add = add;
        }
        return spliceRecord;
    }
    /**
     * A function that produces a value property descriptor, which assumes that properties are enumerable, writable and configurable
     * unless specified
     *
     * @param value The value for the descriptor
     * @param writable Defaults to `true` if not specified
     * @param enumerable Defaults to `true` if not specified
     * @param configurable Defaults to `true` if not specified
     */
    function createValuePropertyDescriptor(value, writable, enumerable, configurable) {
        if (writable === void 0) { writable = true; }
        if (enumerable === void 0) { enumerable = true; }
        if (configurable === void 0) { configurable = true; }
        return object_1.assign(objectCreate(null), {
            value: value,
            writable: writable,
            enumerable: enumerable,
            configurable: configurable
        });
    }
    /**
     * A class which is used when making a custom comparison of a non-plain object or array
     */
    var CustomDiff = /** @class */ (function () {
        function CustomDiff(diff) {
            this._differ = diff;
        }
        /**
         * Get the difference of the `value`
         * @param value The value to diff
         * @param nameOrIndex A `string` if comparing a property or a `number` if comparing an array element
         * @param parent The outer parent that this value is part of
         */
        CustomDiff.prototype.diff = function (value, nameOrIndex, parent) {
            var record = this._differ(value, nameOrIndex, parent);
            if (record && typeof nameOrIndex === 'string') {
                return object_1.assign(record, { name: nameOrIndex });
            }
        };
        return CustomDiff;
    }());
    exports.CustomDiff = CustomDiff;
    /**
     * Internal function that detects the differences between an array and another value and returns a set of splice records that
     * describe the differences
     *
     * @param a The first array to compare to
     * @param b The second value to compare to
     * @param options An options bag that allows configuration of the behaviour of `diffArray()`
     */
    function diffArray(a, b, options) {
        /* This function takes an overly simplistic approach to calculating splice records.  There are many situations where
         * in complicated array mutations, the splice records can be more optimised.
         *
         * TODO: Raise an issue for this when it is finally merged and put into core
         */
        var _a = options.allowFunctionValues, allowFunctionValues = _a === void 0 ? false : _a;
        var arrayA = a;
        var lengthA = arrayA.length;
        var arrayB = isArray(b) ? b : [];
        var lengthB = arrayB.length;
        var patchRecords = [];
        if (!lengthA && lengthB) {
            /* empty array */
            patchRecords.push(createSpliceRecord(0, lengthB));
            return patchRecords;
        }
        var add = [];
        var start = 0;
        var deleteCount = 0;
        var last = -1;
        function flushSpliceRecord() {
            if (deleteCount || add.length) {
                patchRecords.push(createSpliceRecord(start, start + deleteCount > lengthB ? lengthB - start : deleteCount, add));
            }
        }
        function addDifference(index, adding, value) {
            if (index > last + 1) {
                /* flush the splice */
                flushSpliceRecord();
                start = index;
                deleteCount = 0;
                if (add.length) {
                    add = [];
                }
            }
            if (adding) {
                add.push(value);
            }
            deleteCount++;
            last = index;
        }
        arrayA.forEach(function (valueA, index) {
            var valueB = arrayB[index];
            if (index in arrayB &&
                (valueA === valueB || (allowFunctionValues && typeof valueA === 'function' && typeof valueB === 'function'))) {
                return; /* not different */
            }
            var isValueAArray = isArray(valueA);
            var isValueAPlainObject = isPlainObject(valueA);
            if (isValueAArray || isValueAPlainObject) {
                var value = isValueAArray
                    ? isArray(valueB) ? valueB : []
                    : isPlainObject(valueB) ? valueB : Object.create(null);
                var valueRecords = diff(valueA, value, options);
                if (valueRecords.length) {
                    /* only add if there are changes */
                    addDifference(index, true, diff(valueA, value, options));
                }
            }
            else if (isPrimitive(valueA)) {
                addDifference(index, true, valueA);
            }
            else if (allowFunctionValues && typeof valueA === 'function') {
                addDifference(index, true, valueA);
            }
            else {
                throw new TypeError("Value of array element \"" + index + "\" from first argument is not a primative, plain Object, or Array.");
            }
        });
        if (lengthB > lengthA) {
            for (var index = lengthA; index < lengthB; index++) {
                addDifference(index, false);
            }
        }
        /* flush any deletes */
        flushSpliceRecord();
        return patchRecords;
    }
    /**
     * Internal function that detects the differences between plain objects and returns a set of patch records that
     * describe the differences
     *
     * @param a The first plain object to compare to
     * @param b The second plain bject to compare to
     * @param options An options bag that allows configuration of the behaviour of `diffPlainObject()`
     */
    function diffPlainObject(a, b, options) {
        var _a = options.allowFunctionValues, allowFunctionValues = _a === void 0 ? false : _a, _b = options.ignorePropertyValues, ignorePropertyValues = _b === void 0 ? [] : _b;
        var patchRecords = [];
        var _c = getComparableObjects(a, b, options), comparableA = _c.comparableA, comparableB = _c.comparableB;
        /* look for keys in a that are different from b */
        object_2.keys(comparableA).reduce(function (patchRecords, name) {
            var valueA = a[name];
            var valueB = b[name];
            var bHasOwnProperty = hasOwnProperty.call(comparableB, name);
            if (bHasOwnProperty &&
                (valueA === valueB || (allowFunctionValues && typeof valueA === 'function' && typeof valueB === 'function'))) {
                /* not different */
                /* when `allowFunctionValues` is true, functions are simply considered to be equal by `typeof` */
                return patchRecords;
            }
            var type = bHasOwnProperty ? 'update' : 'add';
            var isValueAArray = isArray(valueA);
            var isValueAPlainObject = isPlainObject(valueA);
            if (isValueAArray || isValueAPlainObject) {
                /* non-primitive values we can diff */
                /* this is a bit complicated, but essentially if valueA and valueB are both arrays or plain objects, then
                * we can diff those two values, if not, then we need to use an empty array or an empty object and diff
                * the valueA with that */
                var value = (isValueAArray && isArray(valueB)) || (isValueAPlainObject && isPlainObject(valueB))
                    ? valueB
                    : isValueAArray ? [] : objectCreate(null);
                var valueRecords = diff(valueA, value, options);
                if (valueRecords.length) {
                    /* only add if there are changes */
                    patchRecords.push(createPatchRecord(type, name, createValuePropertyDescriptor(value), diff(valueA, value, options)));
                }
            }
            else if (isCustomDiff(valueA) && !isCustomDiff(valueB)) {
                /* complex diff left hand */
                var result = valueA.diff(valueB, name, b);
                if (result) {
                    patchRecords.push(result);
                }
            }
            else if (isCustomDiff(valueB)) {
                /* complex diff right hand */
                var result = valueB.diff(valueA, name, a);
                if (result) {
                    patchRecords.push(result);
                }
            }
            else if (isPrimitive(valueA) ||
                (allowFunctionValues && typeof valueA === 'function') ||
                isIgnoredPropertyValue(name, a, b, ignorePropertyValues)) {
                /* primitive values, functions values if allowed, or ignored property values can just be copied */
                patchRecords.push(createPatchRecord(type, name, createValuePropertyDescriptor(valueA)));
            }
            else {
                throw new TypeError("Value of property named \"" + name + "\" from first argument is not a primative, plain Object, or Array.");
            }
            return patchRecords;
        }, patchRecords);
        /* look for keys in b that are not in a */
        object_2.keys(comparableB).reduce(function (patchRecords, name) {
            if (!hasOwnProperty.call(comparableA, name)) {
                patchRecords.push(createPatchRecord('delete', name));
            }
            return patchRecords;
        }, patchRecords);
        return patchRecords;
    }
    /**
     * Takes two plain objects to be compared, as well as options customizing the behavior of the comparison, and returns
     * two new objects that contain only those properties that should be compared. If a property is ignored
     * it will not be included in either returned object. If a property's value should be ignored it will be excluded
     * if it is present in both objects.
     * @param a The first object to compare
     * @param b The second object to compare
     * @param options An options bag indicating which properties should be ignored or have their values ignored, if any.
     */
    function getComparableObjects(a, b, options) {
        var _a = options.ignoreProperties, ignoreProperties = _a === void 0 ? [] : _a, _b = options.ignorePropertyValues, ignorePropertyValues = _b === void 0 ? [] : _b;
        var ignore = new Set_1.default();
        var keep = new Set_1.default();
        var isIgnoredProperty = Array.isArray(ignoreProperties)
            ? function (name) {
                return ignoreProperties.some(function (value) { return (typeof value === 'string' ? name === value : value.test(name)); });
            }
            : function (name) { return ignoreProperties(name, a, b); };
        var comparableA = object_2.keys(a).reduce(function (obj, name) {
            if (isIgnoredProperty(name) ||
                (hasOwnProperty.call(b, name) && isIgnoredPropertyValue(name, a, b, ignorePropertyValues))) {
                ignore.add(name);
                return obj;
            }
            keep.add(name);
            obj[name] = a[name];
            return obj;
        }, {});
        var comparableB = object_2.keys(b).reduce(function (obj, name) {
            if (ignore.has(name) || (!keep.has(name) && isIgnoredProperty(name))) {
                return obj;
            }
            obj[name] = b[name];
            return obj;
        }, {});
        return { comparableA: comparableA, comparableB: comparableB, ignore: ignore };
    }
    exports.getComparableObjects = getComparableObjects;
    /**
     * A guard that determines if the value is a `ConstructRecord`
     * @param value The value to check
     */
    function isConstructRecord(value) {
        return Boolean(value && typeof value === 'object' && value !== null && value.Ctor && value.name);
    }
    function isIgnoredPropertyValue(name, a, b, ignoredPropertyValues) {
        return Array.isArray(ignoredPropertyValues)
            ? ignoredPropertyValues.some(function (value) {
                return typeof value === 'string' ? name === value : value.test(name);
            })
            : ignoredPropertyValues(name, a, b);
    }
    /**
     * A guard that determines if the value is a `PatchRecord`
     *
     * @param value The value to check
     */
    function isPatchRecord(value) {
        return Boolean(value && value.type && value.name);
    }
    /**
     * A guard that determines if the value is an array of `PatchRecord`s
     *
     * @param value The value to check
     */
    function isPatchRecordArray(value) {
        return Boolean(isArray(value) && value.length && isPatchRecord(value[0]));
    }
    /**
     * A guard that determines if the value is a plain object.  A plain object is an object that has
     * either no constructor (e.g. `Object.create(null)`) or has Object as its constructor.
     *
     * @param value The value to check
     */
    function isPlainObject(value) {
        return Boolean(value && typeof value === 'object' && (value.constructor === Object || value.constructor === undefined));
    }
    /**
     * A guard that determines if the value is a primitive (including `null`), as these values are
     * fine to just copy.
     *
     * @param value The value to check
     */
    function isPrimitive(value) {
        var typeofValue = typeof value;
        return (value === null ||
            typeofValue === 'undefined' ||
            typeofValue === 'string' ||
            typeofValue === 'number' ||
            typeofValue === 'boolean');
    }
    /**
     * A guard that determines if the value is a `CustomDiff`
     * @param value The value to check
     */
    function isCustomDiff(value) {
        return typeof value === 'object' && value instanceof CustomDiff;
    }
    /**
     * A guard that determines if the value is a `SpliceRecord`
     *
     * @param value The value to check
     */
    function isSpliceRecord(value) {
        return value && value.type === 'splice' && 'start' in value && 'deleteCount' in value;
    }
    /**
     * A guard that determines if the value is an array of `SpliceRecord`s
     *
     * @param value The value to check
     */
    function isSpliceRecordArray(value) {
        return Boolean(isArray(value) && value.length && isSpliceRecord(value[0]));
    }
    /**
     * An internal function that patches a target with a `SpliceRecord`
     */
    function patchSplice(target, _a) {
        var add = _a.add, deleteCount = _a.deleteCount, start = _a.start;
        if (add && add.length) {
            var deletedItems_1 = deleteCount ? target.slice(start, start + deleteCount) : [];
            add = add.map(function (value, index) { return resolveTargetValue(value, deletedItems_1[index]); });
            target.splice.apply(target, tslib_1.__spread([start, deleteCount], add));
        }
        else {
            target.splice(start, deleteCount);
        }
        return target;
    }
    /**
     * An internal function that patches a target with a `PatchRecord`
     */
    function patchPatch(target, record) {
        var name = record.name;
        if (record.type === 'delete') {
            delete target[name];
            return target;
        }
        var descriptor = record.descriptor, valueRecords = record.valueRecords;
        if (valueRecords && valueRecords.length) {
            descriptor.value = patch(descriptor.value, valueRecords);
        }
        defineProperty(target, name, descriptor);
        return target;
    }
    var defaultConstructDescriptor = {
        configurable: true,
        enumerable: true,
        writable: true
    };
    function patchConstruct(target, record) {
        var args = record.args, _a = record.descriptor, descriptor = _a === void 0 ? defaultConstructDescriptor : _a, Ctor = record.Ctor, name = record.name, propertyRecords = record.propertyRecords;
        var value = new (Ctor.bind.apply(Ctor, tslib_1.__spread([void 0], (args || []))))();
        if (propertyRecords) {
            propertyRecords.forEach(function (record) { return (isConstructRecord(record) ? patchConstruct(value, record) : patchPatch(value, record)); });
        }
        defineProperty(target, name, object_1.assign({ value: value }, descriptor));
        return target;
    }
    /**
     * An internal function that takes a value from array being patched and the target value from the same
     * index and determines the value that should actually be patched into the target array
     */
    function resolveTargetValue(patchValue, targetValue) {
        var patchIsSpliceRecordArray = isSpliceRecordArray(patchValue);
        return patchIsSpliceRecordArray || isPatchRecordArray(patchValue)
            ? patch(patchIsSpliceRecordArray
                ? isArray(targetValue) ? targetValue : []
                : isPlainObject(targetValue) ? targetValue : objectCreate(null), patchValue)
            : patchValue;
    }
    /**
     * Compares two plain objects or arrays and return a set of records which describe the differences between the two
     *
     * The records describe what would need to be applied to the second argument to make it look like the first argument
     *
     * @param a The plain object or array to compare with
     * @param b The plain object or array to compare to
     * @param options An options bag that allows configuration of the behaviour of `diff()`
     */
    function diff(a, b, options) {
        if (options === void 0) { options = {}; }
        if (typeof a !== 'object' || typeof b !== 'object') {
            throw new TypeError('Arguments are not of type object.');
        }
        if (isArray(a)) {
            return diffArray(a, b, options);
        }
        if (isArray(b)) {
            b = objectCreate(null);
        }
        if (!isPlainObject(a) || !isPlainObject(b)) {
            throw new TypeError('Arguments are not plain Objects or Arrays.');
        }
        return diffPlainObject(a, b, options);
    }
    exports.diff = diff;
    /**
     * Apply a set of patch records to a target.
     *
     * @param target The plain object or array that the patch records should be applied to
     * @param records A set of patch records to be applied to the target
     */
    function patch(target, records) {
        if (!isArray(target) && !isPlainObject(target)) {
            throw new TypeError('A target for a patch must be either an array or a plain object.');
        }
        if (isFrozen(target) || isSealed(target)) {
            throw new TypeError('Cannot patch sealed or frozen objects.');
        }
        records.forEach(function (record) {
            target = isSpliceRecord(record)
                ? patchSplice(isArray(target) ? target : [], record) /* patch arrays */
                : isConstructRecord(record)
                    ? patchConstruct(target, record) /* patch complex object */
                    : patchPatch(isPlainObject(target) ? target : {}, record); /* patch plain object */
        });
        return target;
    }
    exports.patch = patch;
});
//# sourceMappingURL=compare.js.map