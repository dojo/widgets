import { History, HistoryOptions } from './../interfaces';
export declare class HashHistory implements History {
    private _onChangeFunction;
    private _current;
    private _window;
    constructor({window, onChange}: HistoryOptions);
    normalizePath(path: string): string;
    prefix(path: string): string;
    set(path: string): void;
    readonly current: string;
    destroy(): void;
    private _onChange;
}
export default HashHistory;
