export class MemoryHistory {
    constructor({ onChange }) {
        this._current = '/';
        this._onChangeFunction = onChange;
        this._onChange();
    }
    prefix(path) {
        return path;
    }
    set(path) {
        if (this._current === path) {
            return;
        }
        this._current = path;
        this._onChange();
    }
    get current() {
        return this._current;
    }
    _onChange() {
        this._onChangeFunction(this._current);
    }
}
export default MemoryHistory;
//# sourceMappingURL=MemoryHistory.mjs.map