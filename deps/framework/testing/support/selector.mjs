import { isVNode, isWNode } from '../../widget-core/d';
import * as cssSelect from 'css-select-umd';
export const parseSelector = (selector) => {
    const selectors = selector.split(' ');
    return selectors
        .map((selector) => {
        const keySigilIndex = selector.indexOf('@');
        if (keySigilIndex === 0) {
            return `[key="${selector.substr(1)}"]`;
        }
        else if (keySigilIndex > 0) {
            const key = selector.substring(keySigilIndex + 1);
            return `${selector.slice(0, keySigilIndex)}[key="${key}"]`;
        }
        return selector;
    })
        .join(' ');
};
export const adapter = {
    isTag(elem) {
        return isVNode(elem);
    },
    getText(elem) {
        return '';
    },
    removeSubsets(elements) {
        return elements;
    },
    getChildren(elem) {
        return isVNode(elem) || isWNode(elem) ? elem.children : [];
    },
    getAttributeValue(elem, name) {
        if (isVNode(elem) || isWNode(elem)) {
            if (name === 'class') {
                const classes = elem.properties.classes;
                if (Array.isArray(classes)) {
                    return classes.join(' ');
                }
                return classes;
            }
            return elem.properties[name];
        }
    },
    hasAttrib(elem, name) {
        if (isVNode(elem) || isWNode(elem)) {
            return name in elem.properties;
        }
        return false;
    },
    existsOne(test, elements) {
        return elements.some((elem) => test(elem));
    },
    getName(elem) {
        if (isVNode(elem)) {
            return elem.tag;
        }
    },
    getParent(elem) {
        if (isVNode(elem) || isWNode(elem)) {
            return elem.parent;
        }
    },
    getSiblings(elem) {
        if (isVNode(elem) || isWNode(elem)) {
            if (elem.parent) {
                return elem.parent.children;
            }
            return [elem];
        }
    },
    findOne(test, arr) {
        let elem = null;
        for (let i = 0, l = arr.length; i < l && !elem; i++) {
            if (test(arr[i])) {
                elem = arr[i];
            }
            else {
                const children = adapter.getChildren(arr[i]);
                if (children && children.length > 0) {
                    elem = adapter.findOne(test, children);
                }
            }
        }
        return elem;
    },
    findAll(test, elements) {
        let result = [];
        for (let i = 0, j = elements.length; i < j; i++) {
            if (test(elements[i])) {
                result.push(elements[i]);
            }
            const children = adapter.getChildren(elements[i]);
            if (children) {
                result = [...result, ...adapter.findAll(test, children)];
            }
        }
        return result;
    }
};
export function select(selector, nodes) {
    nodes = Array.isArray(nodes) ? nodes : [nodes];
    selector = parseSelector(selector);
    return cssSelect(selector, nodes, { adapter });
}
export default select;
//# sourceMappingURL=selector.mjs.map