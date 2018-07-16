import { Handle } from './interfaces';
export declare class Destroyable {
    /**
     * register handles for the instance
     */
    private handles;
    /**
     * @constructor
     */
    constructor();
    /**
     * Register handles for the instance that will be destroyed when `this.destroy` is called
     *
     * @param {Handle} handle The handle to add for the instance
     * @returns {Handle} a handle for the handle, removes the handle for the instance and calls destroy
     */
    own(handles: Handle | Handle[]): Handle;
    /**
     * Destrpys all handers registered for the instance
     *
     * @returns {Promise<any} a promise that resolves once all handles have been destroyed
     */
    destroy(): Promise<any>;
}
export default Destroyable;
