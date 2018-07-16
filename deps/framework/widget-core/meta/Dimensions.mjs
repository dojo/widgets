import { Base } from './Base';
import { deepAssign } from '../../core/lang';
const defaultDimensions = {
    client: {
        height: 0,
        left: 0,
        top: 0,
        width: 0
    },
    offset: {
        height: 0,
        left: 0,
        top: 0,
        width: 0
    },
    position: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
    },
    scroll: {
        height: 0,
        left: 0,
        top: 0,
        width: 0
    },
    size: {
        width: 0,
        height: 0
    }
};
export class Dimensions extends Base {
    get(key) {
        const node = this.getNode(key);
        if (!node) {
            return deepAssign({}, defaultDimensions);
        }
        const boundingDimensions = node.getBoundingClientRect();
        return {
            client: {
                height: node.clientHeight,
                left: node.clientLeft,
                top: node.clientTop,
                width: node.clientWidth
            },
            offset: {
                height: node.offsetHeight,
                left: node.offsetLeft,
                top: node.offsetTop,
                width: node.offsetWidth
            },
            position: {
                bottom: boundingDimensions.bottom,
                left: boundingDimensions.left,
                right: boundingDimensions.right,
                top: boundingDimensions.top
            },
            scroll: {
                height: node.scrollHeight,
                left: node.scrollLeft,
                top: node.scrollTop,
                width: node.scrollWidth
            },
            size: {
                width: boundingDimensions.width,
                height: boundingDimensions.height
            }
        };
    }
}
export default Dimensions;
//# sourceMappingURL=Dimensions.mjs.map