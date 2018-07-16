export interface ObjectAssign {
    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param source The source object from which to copy properties.
     */
    <T, U>(target: T, source: U): T & U;
    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param source1 The first source object from which to copy properties.
     * @param source2 The second source object from which to copy properties.
     */
    <T, U, V>(target: T, source1: U, source2: V): T & U & V;
    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param source1 The first source object from which to copy properties.
     * @param source2 The second source object from which to copy properties.
     * @param source3 The third source object from which to copy properties.
     */
    <T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    /**
     * Copy the values of all of the enumerable own properties from one or more source objects to a
     * target object. Returns the target object.
     * @param target The target object to copy to.
     * @param sources One or more source objects from which to copy properties
     */
    (target: object, ...sources: any[]): any;
}
export interface ObjectEnteries {
    /**
     * Returns an array of key/values of the enumerable properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    <T extends {
        [key: string]: any;
    }, K extends keyof T>(o: T): [keyof T, T[K]][];
    /**
     * Returns an array of key/values of the enumerable properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    (o: object): [string, any][];
}
export interface ObjectGetOwnPropertyDescriptors {
    <T>(o: T): {
        [K in keyof T]: PropertyDescriptor;
    };
    (o: any): {
        [key: string]: PropertyDescriptor;
    };
}
export interface ObjectValues {
    /**
     * Returns an array of values of the enumerable properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    <T>(o: {
        [s: string]: T;
    }): T[];
    /**
     * Returns an array of values of the enumerable properties of an object
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    (o: object): any[];
}
export declare let assign: ObjectAssign;
/**
 * Gets the own property descriptor of the specified object.
 * An own property descriptor is one that is defined directly on the object and is not
 * inherited from the object's prototype.
 * @param o Object that contains the property.
 * @param p Name of the property.
 */
export declare let getOwnPropertyDescriptor: <T, K extends keyof T>(o: T, propertyKey: K) => PropertyDescriptor | undefined;
/**
 * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
 * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
 * @param o Object that contains the own properties.
 */
export declare let getOwnPropertyNames: (o: any) => string[];
/**
 * Returns an array of all symbol properties found directly on object o.
 * @param o Object to retrieve the symbols from.
 */
export declare let getOwnPropertySymbols: (o: any) => symbol[];
/**
 * Returns true if the values are the same value, false otherwise.
 * @param value1 The first value.
 * @param value2 The second value.
 */
export declare let is: (value1: any, value2: any) => boolean;
/**
 * Returns the names of the enumerable properties and methods of an object.
 * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
 */
export declare let keys: (o: object) => string[];
export declare let getOwnPropertyDescriptors: ObjectGetOwnPropertyDescriptors;
export declare let entries: ObjectEnteries;
export declare let values: ObjectValues;
