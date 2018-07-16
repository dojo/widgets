import { Base } from './Base';
export interface FocusResults {
    active: boolean;
    containsFocus: boolean;
}
export declare class Focus extends Base {
    private _activeElement;
    get(key: string | number): FocusResults;
    set(key: string | number): void;
    private _onFocusChange;
    private _createListener();
    private _removeListener();
}
export default Focus;
