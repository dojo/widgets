import { Hash } from './interfaces';
/**
 * Object with string keys and string or string array values that describes a query string.
 */
export declare type ParamList = Hash<string | string[]>;
/**
 * Represents a set of URL query search parameters.
 */
export declare class UrlSearchParams {
    /**
     * Constructs a new UrlSearchParams from a query string, an object of parameters and values, or another
     * UrlSearchParams.
     */
    constructor(input?: string | ParamList | UrlSearchParams);
    /**
     * Maps property keys to arrays of values. The value for any property that has been set will be an array containing
     * at least one item. Properties that have been deleted will have a value of 'undefined'.
     */
    protected readonly _list: Hash<string[] | undefined>;
    /**
     * Appends a new value to the set of values for a key.
     * @param key The key to add a value for
     * @param value The value to add
     */
    append(key: string, value: string): void;
    /**
     * Deletes all values for a key.
     * @param key The key whose values are to be removed
     */
    delete(key: string): void;
    /**
     * Returns the first value associated with a key.
     * @param key The key to return the first value for
     * @return The first string value for the key
     */
    get(key: string): string | undefined;
    /**
     * Returns all the values associated with a key.
     * @param key The key to return all values for
     * @return An array of strings containing all values for the key
     */
    getAll(key: string): string[] | undefined;
    /**
     * Returns true if a key has been set to any value, false otherwise.
     * @param key The key to test for existence
     * @return A boolean indicating if the key has been set
     */
    has(key: string): boolean;
    /**
     * Returns an array of all keys which have been set.
     * @return An array of strings containing all keys set in the UrlSearchParams instance
     */
    keys(): string[];
    /**
     * Sets the value associated with a key.
     * @param key The key to set the value of
     */
    set(key: string, value: string): void;
    /**
     * Returns this object's data as an encoded query string.
     * @return A string in application/x-www-form-urlencoded format containing all of the set keys/values
     */
    toString(): string;
}
export default UrlSearchParams;
