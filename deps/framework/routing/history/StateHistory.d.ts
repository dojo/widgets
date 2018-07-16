import { History as HistoryInterface, HistoryOptions } from './../interfaces';
export declare class StateHistory implements HistoryInterface {
    private _current;
    private _onChangeFunction;
    private _window;
    private _base;
    constructor({onChange, window, base}: HistoryOptions);
    prefix(path: string): string;
    set(path: string): void;
    readonly current: string;
    private _onChange;
}
export default StateHistory;
