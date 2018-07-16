import Map from '../shim/Map';
import WeakMap from '../shim/WeakMap';
import '../shim/Symbol';
import List from './List';
const noop = () => { };
const privateStateMap = new WeakMap();
function getState(instance) {
    return privateStateMap.get(instance);
}
/**
 * A registry of values, mapped by identities.
 */
export class IdentityRegistry {
    constructor() {
        privateStateMap.set(this, {
            entryMap: new Map(),
            idMap: new WeakMap()
        });
    }
    /**
     * Look up a value by its identifier.
     *
     * Throws if no value has been registered for the given identifier.
     *
     * @param id The identifier
     * @return The value
     */
    get(id) {
        const entry = getState(this).entryMap.get(id);
        if (!entry) {
            throw new Error(`Could not find a value for identity '${id.toString()}'`);
        }
        return entry.value;
    }
    /**
     * Determine whether the value has been registered.
     * @param value The value
     * @return `true` if the value has been registered, `false` otherwise
     */
    contains(value) {
        return getState(this).idMap.has(value);
    }
    /**
     * Remove from the registry the value for a given identifier.
     * @param id The identifier
     * @return `true` if the value was removed, `false` otherwise
     */
    delete(id) {
        const entry = getState(this).entryMap.get(id);
        if (!entry) {
            return false;
        }
        entry.handle.destroy();
        return true;
    }
    /**
     * Determine whether a value has been registered for the given identifier.
     * @param id The identifier
     * @return `true` if a value has been registered, `false` otherwise
     */
    has(id) {
        return getState(this).entryMap.has(id);
    }
    /**
     * Look up the identifier for which the given value has been registered.
     *
     * Throws if the value hasn't been registered.
     *
     * @param value The value
     * @return The identifier otherwise
     */
    identify(value) {
        if (!this.contains(value)) {
            throw new Error('Could not identify non-registered value');
        }
        return getState(this).idMap.get(value);
    }
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
    register(id, value) {
        const entryMap = getState(this).entryMap;
        const existingEntry = entryMap.get(id);
        if (existingEntry && existingEntry.value !== value) {
            const str = id.toString();
            throw new Error(`A value has already been registered for the given identity (${str})`);
        }
        const existingId = this.contains(value) ? this.identify(value) : null;
        if (existingId && existingId !== id) {
            const str = existingId.toString();
            throw new Error(`The value has already been registered with a different identity (${str})`);
        }
        // Adding the same value with the same id is a noop, return the original handle.
        if (existingEntry && existingId) {
            return existingEntry.handle;
        }
        const handle = {
            destroy: () => {
                handle.destroy = noop;
                getState(this).entryMap.delete(id);
            }
        };
        entryMap.set(id, { handle, value });
        getState(this).idMap.set(value, id);
        return handle;
    }
    entries() {
        const values = new List();
        getState(this).entryMap.forEach((value, key) => {
            values.add([key, value.value]);
        });
        return values.values();
    }
    values() {
        const values = new List();
        getState(this).entryMap.forEach((value, key) => {
            values.add(value.value);
        });
        return values.values();
    }
    ids() {
        return getState(this).entryMap.keys();
    }
    [Symbol.iterator]() {
        return this.entries();
    }
}
export default IdentityRegistry;
//# sourceMappingURL=IdentityRegistry.mjs.map