import assertRender from './support/assertRender';
import { select } from './support/selector';
import { decorate, isVNode, isWNode } from '../widget-core/d';
function decorateNodes(dNode) {
    let hasDeferredProperties = false;
    function addParent(parent) {
        (parent.children || []).forEach((child) => {
            if (isVNode(child) || isWNode(child)) {
                child.parent = parent;
            }
        });
        if (isVNode(parent) && typeof parent.deferredPropertiesCallback === 'function') {
            hasDeferredProperties = true;
            parent.properties = Object.assign({}, parent.properties, parent.deferredPropertiesCallback(false));
        }
    }
    const nodes = decorate(dNode, addParent, (node) => isWNode(node) || isVNode(node));
    return { hasDeferredProperties, nodes };
}
export function harness(renderFunc, customComparator = []) {
    let invalidated = true;
    let wNode = renderFunc();
    let widget;
    const renderStack = [];
    const { properties, children } = wNode;
    const widgetConstructor = wNode.widgetConstructor;
    if (typeof widgetConstructor === 'function') {
        widget = new class extends widgetConstructor {
            invalidate() {
                invalidated = true;
                super.invalidate();
            }
        }();
        widget.__setProperties__(properties);
        widget.__setChildren__(children);
        _tryRender();
    }
    else {
        throw new Error('Harness does not support registry items');
    }
    function _getRender(count) {
        return count ? renderStack[count] : renderStack[renderStack.length - 1];
    }
    function _runCompares(nodes, isExpected = false) {
        customComparator.forEach(({ selector, property, comparator }) => {
            const items = select(selector, nodes);
            items.forEach((item, index) => {
                const comparatorName = `comparator(selector=${selector}, ${property})`;
                if (item && item.properties && item.properties[property] !== undefined) {
                    const comparatorResult = comparator(item.properties[property])
                        ? comparatorName
                        : `${comparatorName} FAILED`;
                    item.properties[property] = isExpected ? comparatorName : comparatorResult;
                }
            });
        });
    }
    function _tryRender() {
        const { properties, children } = renderFunc();
        widget.__setProperties__(properties);
        widget.__setChildren__(children);
        if (invalidated) {
            const render = widget.__render__();
            const { hasDeferredProperties, nodes } = decorateNodes(render);
            _runCompares(nodes);
            renderStack.push(nodes);
            if (hasDeferredProperties) {
                const { nodes: afterDeferredPropertiesNodes } = decorateNodes(render);
                _runCompares(afterDeferredPropertiesNodes);
                renderStack.push(afterDeferredPropertiesNodes);
            }
            invalidated = false;
        }
    }
    function _expect(expectedRenderFunc, actualRenderFunc, selector) {
        let renderResult;
        if (actualRenderFunc === undefined) {
            _tryRender();
            renderResult = _getRender();
        }
        else {
            renderResult = actualRenderFunc();
        }
        const { nodes: expectedRenderResult } = decorateNodes(expectedRenderFunc());
        _runCompares(expectedRenderResult, true);
        if (selector) {
            const [firstItem] = select(selector, renderResult);
            assertRender(firstItem, expectedRenderResult);
        }
        else {
            assertRender(renderResult, expectedRenderResult);
        }
    }
    return {
        expect(expectedRenderFunc, actualRenderFunc) {
            return _expect(expectedRenderFunc, actualRenderFunc);
        },
        expectPartial(selector, expectedRenderFunc, actualRenderFunc) {
            return _expect(expectedRenderFunc, actualRenderFunc, selector);
        },
        trigger(selector, functionSelector, ...args) {
            _tryRender();
            const [firstItem] = select(selector, _getRender());
            if (firstItem) {
                let triggerFunction;
                if (typeof functionSelector === 'string') {
                    triggerFunction = firstItem.properties[functionSelector];
                }
                else {
                    triggerFunction = functionSelector(firstItem);
                }
                if (triggerFunction) {
                    return triggerFunction.apply(widget, args);
                }
            }
        },
        getRender(index) {
            return _getRender(index);
        }
    };
}
export default harness;
//# sourceMappingURL=harness.mjs.map