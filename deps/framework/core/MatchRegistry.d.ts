import { Handle } from './interfaces';
/**
 * A registry of values tagged with matchers.
 */
export declare class MatchRegistry<T> {
    protected _defaultValue: T | undefined;
    private readonly _entries;
    /**
     * Construct a new MatchRegistry, optionally containing a given default value.
     */
    constructor(defaultValue?: T);
    /**
     * Return the first entry in this registry that matches the given arguments. If no entry matches and the registry
     * was created with a default value, that value will be returned. Otherwise, an exception is thrown.
     *
     * @param ...args Arguments that will be used to select a matching value.
     * @returns the matching value, or a default value if one exists.
     */
    match(...args: any[]): T;
    /**
     * Register a test + value pair with this registry.
     *
     * @param test The test that will be used to determine if the registered value matches a set of arguments.
     * @param value A value being registered.
     * @param first If true, the newly registered test and value will be the first entry in the registry.
     */
    register(test: Test | null, value: T | null, first?: boolean): Handle;
}
/**
 * The interface that a test function must implement.
 */
export interface Test {
    (...args: any[]): boolean | null;
}
export default MatchRegistry;
