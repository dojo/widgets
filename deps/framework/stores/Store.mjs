import { Evented } from '../core/Evented';
import { Patch } from './state/Patch';
import { Pointer } from './state/Pointer';
import Map from '../shim/Map';
function isString(segment) {
    return typeof segment === 'string';
}
/**
 * Application state store
 */
export class Store extends Evented {
    constructor() {
        super(...arguments);
        /**
         * The private state object
         */
        this._state = {};
        this._changePaths = new Map();
        this._callbackId = 0;
        /**
         * Returns the state at a specific pointer path location.
         */
        this.get = (path) => {
            return path.value;
        };
        /**
         * Applies store operations to state and returns the undo operations
         */
        this.apply = (operations, invalidate = false) => {
            const patch = new Patch(operations);
            const patchResult = patch.apply(this._state);
            this._state = patchResult.object;
            if (invalidate) {
                this.invalidate();
            }
            return patchResult.undoOperations;
        };
        this.at = (path, index) => {
            const array = this.get(path);
            const value = array && array[index];
            return {
                path: `${path.path}/${index}`,
                state: path.state,
                value
            };
        };
        this.onChange = (paths, callback) => {
            const callbackId = this._callbackId;
            if (!Array.isArray(paths)) {
                paths = [paths];
            }
            paths.forEach((path) => this._addOnChange(path, callback, callbackId));
            this._callbackId += 1;
            return {
                remove: () => {
                    paths.forEach((path) => {
                        const onChange = this._changePaths.get(path.path);
                        if (onChange) {
                            onChange.callbacks = onChange.callbacks.filter((callback) => {
                                return callback.callbackId !== callbackId;
                            });
                        }
                    });
                }
            };
        };
        this._addOnChange = (path, callback, callbackId) => {
            let changePaths = this._changePaths.get(path.path);
            if (!changePaths) {
                changePaths = { callbacks: [], previousValue: this.get(path) };
            }
            changePaths.callbacks.push({ callbackId, callback });
            this._changePaths.set(path.path, changePaths);
        };
        this.path = (path, ...segments) => {
            if (typeof path === 'string') {
                segments = [path, ...segments];
            }
            else {
                segments = [...new Pointer(path.path).segments, ...segments];
            }
            const stringSegments = segments.filter(isString);
            const hasMultipleSegments = stringSegments.length > 1;
            const pointer = new Pointer(hasMultipleSegments ? stringSegments : stringSegments[0] || '');
            return {
                path: pointer.path,
                state: this._state,
                value: pointer.get(this._state)
            };
        };
    }
    _runOnChanges() {
        const callbackIdsCalled = [];
        this._changePaths.forEach((value, path) => {
            const { previousValue, callbacks } = value;
            const newValue = new Pointer(path).get(this._state);
            if (previousValue !== newValue) {
                this._changePaths.set(path, { callbacks, previousValue: newValue });
                callbacks.forEach((callbackItem) => {
                    const { callback, callbackId } = callbackItem;
                    if (callbackIdsCalled.indexOf(callbackId) === -1) {
                        callbackIdsCalled.push(callbackId);
                        callback();
                    }
                });
            }
        });
    }
    /**
     * Emits an invalidation event
     */
    invalidate() {
        this._runOnChanges();
        this.emit({ type: 'invalidate' });
    }
}
export default Store;
//# sourceMappingURL=Store.mjs.map