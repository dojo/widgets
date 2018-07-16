import { Base } from './Base';
import { createHandle } from '../../core/lang';
import global from '../../shim/global';
const defaultResults = {
    active: false,
    containsFocus: false
};
export class Focus extends Base {
    constructor() {
        super(...arguments);
        this._onFocusChange = () => {
            this._activeElement = global.document.activeElement;
            this.invalidate();
        };
    }
    get(key) {
        const node = this.getNode(key);
        if (!node) {
            return Object.assign({}, defaultResults);
        }
        if (!this._activeElement) {
            this._activeElement = global.document.activeElement;
            this._createListener();
        }
        return {
            active: node === this._activeElement,
            containsFocus: !!this._activeElement && node.contains(this._activeElement)
        };
    }
    set(key) {
        const node = this.getNode(key);
        node && node.focus();
    }
    _createListener() {
        global.document.addEventListener('focusin', this._onFocusChange);
        global.document.addEventListener('focusout', this._onFocusChange);
        this.own(createHandle(this._removeListener.bind(this)));
    }
    _removeListener() {
        global.document.removeEventListener('focusin', this._onFocusChange);
        global.document.removeEventListener('focusout', this._onFocusChange);
    }
}
export default Focus;
//# sourceMappingURL=Focus.mjs.map