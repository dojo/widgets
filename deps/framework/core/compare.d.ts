import Set from '../shim/Set';
export declare type IgnorePropertyFunction = (name: string, a: any, b: any) => boolean;
export interface DiffOptions {
    /**
     * Allow functions to be values.  Values will be considered equal if the `typeof` both values are `function`.
     * When adding or updating the property, the value of the property of `a` will be used in the record, which
     * will be a reference to the function.
     */
    allowFunctionValues?: boolean;
    /**
     * An array of strings or regular expressions which flag certain properties to be ignored.  Alternatively
     * a function, which returns `true` to have the property ignored or `false` to diff the property.
     */
    ignoreProperties?: (string | RegExp)[] | IgnorePropertyFunction;
    /**
     * An array of strings or regular expressions which flag certain values to be ignored.  For flagged properties,
     * if the property is present in both `a` and `b` the value will be ignored.  If adding the property,
     * whatever the value of the property of `a` will be used, which could be a reference.
     */
    ignorePropertyValues?: (string | RegExp)[] | IgnorePropertyFunction;
}
/**
 * Interface for a generic constructor function
 */
export interface Constructor {
    new (...args: any[]): object;
    prototype: object;
}
/**
 * A partial property descriptor that provides the property descriptor flags supported by the
 * complex property construction of `patch()`
 *
 * All properties are value properties, with the value being supplied by the `ConstructRecord`
 */
export interface ConstructDescriptor {
    /**
     * Is the property configurable?
     */
    configurable?: boolean;
    /**
     * Is the property enumerable?
     */
    enumerable?: boolean;
    /**
     * Is the property configurable?
     */
    writable?: boolean;
}
/**
 * A record that describes a constructor function and arguments necessary to create an instance of
 * an object
 */
export interface AnonymousConstructRecord {
    /**
     * Any arguments to pass to the constructor function
     */
    args?: any[];
    /**
     * The constructor function to use to create the instance
     */
    Ctor: Constructor;
    /**
     * The partial descriptor that is used to set the value of the instance
     */
    descriptor?: ConstructDescriptor;
    /**
     * Any patches to properties that need to occur on the instance
     */
    propertyRecords?: (ConstructRecord | PatchRecord)[];
}
export interface ConstructRecord extends AnonymousConstructRecord {
    /**
     * The name of the property on the Object
     */
    name: string;
}
/**
 * A record that describes the mutations necessary to a property of an object to make that property look
 * like another
 */
export declare type PatchRecord = {
    /**
     * The name of the property on the Object
     */
    name: string;
    /**
     * The type of the patch
     */
    type: 'delete';
} | {
    /**
     * A property descriptor that describes the property in `name`
     */
    descriptor: PropertyDescriptor;
    /**
     * The name of the property on the Object
     */
    name: string;
    /**
     * The type of the patch
     */
    type: 'add' | 'update';
    /**
     * Additional patch records which describe the value of the property
     */
    valueRecords?: (ConstructRecord | PatchRecord | SpliceRecord)[];
};
/**
 * The different types of patch records supported
 */
export declare type PatchTypes = 'add' | 'update' | 'delete';
/**
 * A record that describes a splice operation to perform on an array to make the array look like another array
 */
export interface SpliceRecord {
    /**
     * Any items that are being added to the array
     */
    add?: any[];
    /**
     * The number of items in the array to delete
     */
    deleteCount: number;
    /**
     * The type, set to `splice`
     */
    type: 'splice';
    /**
     * The index of where to start the splice
     */
    start: number;
}
/**
 * A record that describes how to instantiate a new object via a constructor function
 * @param Ctor The constructor function
 * @param args Any arguments to be passed to the constructor function
 */
export declare function createConstructRecord(Ctor: Constructor, args?: any[], descriptor?: ConstructDescriptor): AnonymousConstructRecord;
/**
 * A function that returns a constructor record or `undefined` when diffing a value
 */
export declare type CustomDiffFunction<T> = (value: T, nameOrIndex: string | number, parent: object) => AnonymousConstructRecord | void;
/**
 * A class which is used when making a custom comparison of a non-plain object or array
 */
export declare class CustomDiff<T> {
    private _differ;
    constructor(diff: CustomDiffFunction<T>);
    /**
     * Get the difference of the `value`
     * @param value The value to diff
     * @param nameOrIndex A `string` if comparing a property or a `number` if comparing an array element
     * @param parent The outer parent that this value is part of
     */
    diff(value: T, nameOrIndex: string | number, parent: object): ConstructRecord | void;
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
export declare function getComparableObjects(a: any, b: any, options: DiffOptions): {
    comparableA: {
        [key: string]: any;
    };
    comparableB: {
        [key: string]: any;
    };
    ignore: Set<string>;
};
/**
 * Compares two plain objects or arrays and return a set of records which describe the differences between the two
 *
 * The records describe what would need to be applied to the second argument to make it look like the first argument
 *
 * @param a The plain object or array to compare with
 * @param b The plain object or array to compare to
 * @param options An options bag that allows configuration of the behaviour of `diff()`
 */
export declare function diff(a: any, b: any, options?: DiffOptions): (ConstructRecord | PatchRecord | SpliceRecord)[];
/**
 * Apply a set of patch records to a target.
 *
 * @param target The plain object or array that the patch records should be applied to
 * @param records A set of patch records to be applied to the target
 */
export declare function patch(target: any, records: (ConstructRecord | PatchRecord | SpliceRecord)[]): any;
