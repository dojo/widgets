import { Handle } from './interfaces';
import { QueueItem } from './queue';
export interface KwArgs {
    deferWhileProcessing?: boolean;
    queueFunction?: (callback: (...args: any[]) => any) => Handle;
}
export declare class Scheduler {
    protected readonly _boundDispatch: () => void;
    protected _deferred: QueueItem[] | null;
    protected _isProcessing: boolean;
    protected readonly _queue: QueueItem[];
    protected _task: Handle | null;
    /**
     * Determines whether any callbacks registered during should be added to the current batch (`false`)
     * or deferred until the next batch (`true`, default).
     */
    deferWhileProcessing: boolean | undefined;
    /**
     * Allows users to specify the function that should be used to schedule callbacks.
     * If no function is provided, then `queueTask` will be used.
     */
    queueFunction: (callback: (...args: any[]) => any) => Handle;
    protected _defer(callback: (...args: any[]) => void): Handle;
    protected _dispatch(): void;
    protected _schedule(item: QueueItem): void;
    constructor(kwArgs?: KwArgs);
    schedule(callback: (...args: any[]) => void): Handle;
}
export default Scheduler;
