import global from '../../shim/global';
export class HashHistory {
    constructor({ window = global.window, onChange }) {
        this._onChange = () => {
            this._current = this.normalizePath(this._window.location.hash);
            this._onChangeFunction(this._current);
        };
        this._onChangeFunction = onChange;
        this._window = window;
        this._window.addEventListener('hashchange', this._onChange, false);
        this._current = this.normalizePath(this._window.location.hash);
        this._onChangeFunction(this._current);
    }
    normalizePath(path) {
        return path.replace('#', '');
    }
    prefix(path) {
        if (path[0] !== '#') {
            return `#${path}`;
        }
        return path;
    }
    set(path) {
        this._window.location.hash = this.prefix(path);
    }
    get current() {
        return this._current;
    }
    destroy() {
        this._window.removeEventListener('hashchange', this._onChange);
    }
}
export default HashHistory;
//# sourceMappingURL=HashHistory.mjs.map