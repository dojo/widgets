import { Iterable, IterableIterator } from '../shim/iterator';
import { Handle } from './interfaces';
import '../shim/Symbol';
/**
 * Registry identities can be strings or symbols. Note that the empty string is allowed.
 */
export declare type Identity = string | symbol;
/**
 * A registry of values, mapped by identities.
 */
export declare class IdentityRegistry<V extends object> implements Iterable<[Identity, V]> {
    constructor();
    /**
     * Look up a value by its identifier.
     *
     * Throws if no value has been registered for the given identifier.
     *
     * @param id The identifier
     * @return The value
     */
    get(id: Identity): V;
    /**
     * Determine whether the value has been registered.
     * @param value The value
     * @return `true` if the value has been registered, `false` otherwise
     */
    contains(value: V): boolean;
    /**
     * Remove from the registry the value for a given identifier.
     * @param id The identifier
     * @return `true` if the value was removed, `false` otherwise
     */
    delete(id: Identity): boolean;
    /**
     * Determine whether a value has been registered for the given identifier.
     * @param id The identifier
     * @return `true` if a value has been registered, `false` otherwise
     */
    has(id: Identity): boolean;
    /**
     * Look up the identifier for which the given value has been registered.
     *
     * Throws if the value hasn't been registered.
     *
     * @param value The value
     * @return The identifier otherwise
     */
    identify(value: V): Identity | undefined;
    /**
     * Register a new value with a new identity.
     *
     * Throws if a different value has already been registered for the given identity,
     * or if the value has already been registered with a different identity.
     *
     * @param id The identifier
     * @param value The value
     * @return A handle for deregistering the value. Note that when called repeatedly with
     *   the same identifier and value combination, the same handle is returned
     */
    register(id: Identity, value: V): Handle;
    entries(): IterableIterator<[Identity, V]>;
    values(): IterableIterator<V>;
    ids(): IterableIterator<Identity>;
    [Symbol.iterator](): IterableIterator<[Identity, V]>;
}
export default IdentityRegistry;
