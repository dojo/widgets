import * as tslib_1 from "tslib";
import { diffProperty } from './../decorators/diffProperty';
function diffFocus(previousProperty, newProperty) {
    const result = newProperty && newProperty();
    return {
        changed: result,
        value: newProperty
    };
}
export function FocusMixin(Base) {
    class Focus extends Base {
        constructor() {
            super(...arguments);
            this._currentToken = 0;
            this._previousToken = 0;
            this.shouldFocus = () => {
                const result = this._currentToken !== this._previousToken;
                this._previousToken = this._currentToken;
                return result;
            };
        }
        isFocusedReaction() {
            this._currentToken++;
        }
        focus() {
            this._currentToken++;
            this.invalidate();
        }
    }
    tslib_1.__decorate([
        diffProperty('focus', diffFocus)
    ], Focus.prototype, "isFocusedReaction", null);
    return Focus;
}
export default FocusMixin;
//# sourceMappingURL=Focus.mjs.map