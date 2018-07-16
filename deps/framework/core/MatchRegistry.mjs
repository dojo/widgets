/**
 * A registry of values tagged with matchers.
 */
export class MatchRegistry {
    /**
     * Construct a new MatchRegistry, optionally containing a given default value.
     */
    constructor(defaultValue) {
        this._defaultValue = defaultValue;
        this._entries = [];
    }
    /**
     * Return the first entry in this registry that matches the given arguments. If no entry matches and the registry
     * was created with a default value, that value will be returned. Otherwise, an exception is thrown.
     *
     * @param ...args Arguments that will be used to select a matching value.
     * @returns the matching value, or a default value if one exists.
     */
    match(...args) {
        const entries = this._entries ? this._entries.slice(0) : [];
        let entry;
        for (let i = 0; (entry = entries[i]); ++i) {
            if (entry.value && entry.test && entry.test.apply(null, args)) {
                return entry.value;
            }
        }
        if (this._defaultValue !== undefined) {
            return this._defaultValue;
        }
        throw new Error('No match found');
    }
    /**
     * Register a test + value pair with this registry.
     *
     * @param test The test that will be used to determine if the registered value matches a set of arguments.
     * @param value A value being registered.
     * @param first If true, the newly registered test and value will be the first entry in the registry.
     */
    register(test, value, first) {
        let entries = this._entries;
        let entry = {
            test: test,
            value: value
        };
        entries[first ? 'unshift' : 'push'](entry);
        return {
            destroy: function () {
                this.destroy = function () { };
                let i = 0;
                if (entries && entry) {
                    while ((i = entries.indexOf(entry, i)) > -1) {
                        entries.splice(i, 1);
                    }
                }
                test = value = entries = entry = null;
            }
        };
    }
}
export default MatchRegistry;
//# sourceMappingURL=MatchRegistry.mjs.map