import { Base } from './Base';
import Map from '../../shim/Map';
export class Resize extends Base {
    constructor() {
        super(...arguments);
        this._details = new Map();
    }
    get(key, predicates = {}) {
        const node = this.getNode(key);
        if (!node) {
            const defaultResponse = {};
            for (let predicateId in predicates) {
                defaultResponse[predicateId] = false;
            }
            return defaultResponse;
        }
        if (!this._details.has(key)) {
            this._details.set(key, {});
            const resizeObserver = new ResizeObserver(([entry]) => {
                let predicateChanged = false;
                if (Object.keys(predicates).length) {
                    const { contentRect } = entry;
                    const previousDetails = this._details.get(key);
                    let predicateResponses = {};
                    for (let predicateId in predicates) {
                        const response = predicates[predicateId](contentRect);
                        predicateResponses[predicateId] = response;
                        if (!predicateChanged && response !== previousDetails[predicateId]) {
                            predicateChanged = true;
                        }
                    }
                    this._details.set(key, predicateResponses);
                }
                else {
                    predicateChanged = true;
                }
                predicateChanged && this.invalidate();
            });
            resizeObserver.observe(node);
        }
        return this._details.get(key);
    }
}
export default Resize;
//# sourceMappingURL=Resize.mjs.map