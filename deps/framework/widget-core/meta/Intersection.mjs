import global from '../../shim/global';
import WeakMap from '../../shim/WeakMap';
import Map from '../../shim/Map';
import { createHandle } from '../../core/lang';
import { Base } from './Base';
const defaultIntersection = Object.freeze({
    intersectionRatio: 0,
    isIntersecting: false
});
export class Intersection extends Base {
    constructor() {
        super(...arguments);
        this._details = new Map();
        this._onIntersect = (detailEntries) => {
            return (entries) => {
                for (const { intersectionRatio, isIntersecting, target } of entries) {
                    detailEntries.set(target, { intersectionRatio, isIntersecting });
                }
                this.invalidate();
            };
        };
    }
    /**
     * Return an `InteractionResult` for the requested key and options.
     *
     * @param key The key to return the intersection meta for
     * @param options The options for the request
     */
    get(key, options = {}) {
        let rootNode;
        if (options.root) {
            rootNode = this.getNode(options.root);
            if (!rootNode) {
                return defaultIntersection;
            }
        }
        const node = this.getNode(key);
        if (!node) {
            return defaultIntersection;
        }
        let details = this._getDetails(options) || this._createDetails(options, rootNode);
        if (!details.entries.get(node)) {
            details.entries.set(node, defaultIntersection);
            details.observer.observe(node);
        }
        return details.entries.get(node) || defaultIntersection;
    }
    /**
     * Returns true if the node for the key has intersection details
     *
     * @param key The key to return the intersection meta for
     * @param options The options for the request
     */
    has(key, options) {
        const node = this.getNode(key);
        const details = this._getDetails(options);
        return Boolean(details && node && details.entries.has(node));
    }
    _createDetails(options, rootNode) {
        const entries = new WeakMap();
        const observer = new global.IntersectionObserver(this._onIntersect(entries), Object.assign({}, options, { root: rootNode }));
        const details = Object.assign({ observer, entries }, options);
        this._details.set(JSON.stringify(options), details);
        this.own(createHandle(() => observer.disconnect()));
        return details;
    }
    _getDetails(options = {}) {
        return this._details.get(JSON.stringify(options));
    }
}
export default Intersection;
//# sourceMappingURL=Intersection.mjs.map