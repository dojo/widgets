import { History, HistoryOptions } from './../interfaces';
export declare class MemoryHistory implements History {
    private _onChangeFunction;
    private _current;
    constructor({onChange}: HistoryOptions);
    prefix(path: string): string;
    set(path: string): void;
    readonly current: string;
    private _onChange();
}
export default MemoryHistory;
