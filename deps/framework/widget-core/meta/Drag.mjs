import { deepAssign } from '../../core/lang';
import global from '../../shim/global';
import { assign } from '../../shim/object';
import WeakMap from '../../shim/WeakMap';
import { Base } from './Base';
function createNodeData(invalidate) {
    return {
        dragResults: deepAssign({}, emptyResults),
        invalidate,
        last: createPositionMatrix(),
        start: createPositionMatrix()
    };
}
/**
 * Creates an empty position
 */
function createPosition() {
    return { x: 0, y: 0 };
}
/**
 * Create an empty position matrix
 */
function createPositionMatrix() {
    return {
        client: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
        page: { x: 0, y: 0 },
        screen: { x: 0, y: 0 }
    };
}
/**
 * A frozen empty result object, frozen to ensure that no one downstream modifies it
 */
const emptyResults = Object.freeze({
    delta: Object.freeze(createPosition()),
    isDragging: false
});
/**
 * Return the x/y position matrix for an event
 * @param event The pointer event
 */
function getPositionMatrix(event) {
    return {
        client: {
            x: event.clientX,
            y: event.clientY
        },
        offset: {
            x: event.offsetX,
            y: event.offsetY
        },
        page: {
            x: event.pageX,
            y: event.pageY
        },
        screen: {
            x: event.screenX,
            y: event.screenY
        }
    };
}
/**
 * Return the delta position between two positions
 * @param start The first position
 * @param current The second position
 */
function getDelta(start, current) {
    return {
        x: current.client.x - start.client.x,
        y: current.client.y - start.client.y
    };
}
/**
 * Sets the `touch-action` on nodes so that PointerEvents are always emitted for the node
 * @param node The node to init
 */
function initNode(node) {
    // Ensure that the node has `touch-action` none
    node.style.touchAction = 'none';
    // PEP requires an attribute of `touch-action` to be set on the element
    node.setAttribute('touch-action', 'none');
}
class DragController {
    constructor() {
        this._nodeMap = new WeakMap();
        this._dragging = undefined;
        this._onDragStart = (event) => {
            const { _dragging } = this;
            if (!event.isPrimary && _dragging) {
                // we have a second touch going on here, while we are dragging, so we aren't really dragging, so we
                // will close this down
                const state = this._nodeMap.get(_dragging);
                state.dragResults.isDragging = false;
                state.invalidate();
                this._dragging = undefined;
                return;
            }
            if (event.button !== 0) {
                // it isn't the primary button that is being clicked, so we will ignore this
                return;
            }
            const data = this._getData(event.target);
            if (data) {
                const { state, target } = data;
                this._dragging = target;
                state.last = state.start = getPositionMatrix(event);
                state.dragResults.delta = createPosition();
                state.dragResults.start = deepAssign({}, state.start);
                state.dragResults.isDragging = true;
                state.invalidate();
                event.preventDefault();
                event.stopPropagation();
            } // else, we are ignoring the event
        };
        this._onDrag = (event) => {
            const { _dragging } = this;
            if (!_dragging) {
                return;
            }
            // state cannot be unset, using ! operator
            const state = this._nodeMap.get(_dragging);
            state.last = getPositionMatrix(event);
            state.dragResults.delta = getDelta(state.start, state.last);
            if (!state.dragResults.start) {
                state.dragResults.start = deepAssign({}, state.start);
            }
            state.invalidate();
            event.preventDefault();
            event.stopPropagation();
        };
        this._onDragStop = (event) => {
            const { _dragging } = this;
            if (!_dragging) {
                return;
            }
            // state cannot be unset, using ! operator
            const state = this._nodeMap.get(_dragging);
            state.last = getPositionMatrix(event);
            state.dragResults.delta = getDelta(state.start, state.last);
            if (!state.dragResults.start) {
                state.dragResults.start = deepAssign({}, state.start);
            }
            state.dragResults.isDragging = false;
            state.invalidate();
            this._dragging = undefined;
            event.preventDefault();
            event.stopPropagation();
        };
        const win = global.window;
        win.addEventListener('pointerdown', this._onDragStart);
        // Use capture phase, to determine the right node target, as it will be top down versus bottom up
        win.addEventListener('pointermove', this._onDrag, true);
        win.addEventListener('pointerup', this._onDragStop, true);
    }
    _getData(target) {
        if (this._nodeMap.has(target)) {
            return { state: this._nodeMap.get(target), target };
        }
        if (target.parentElement) {
            return this._getData(target.parentElement);
        }
    }
    get(node, invalidate) {
        const { _nodeMap } = this;
        // first time we see a node, we will initialize its state and properties
        if (!_nodeMap.has(node)) {
            _nodeMap.set(node, createNodeData(invalidate));
            initNode(node);
            return emptyResults;
        }
        const state = _nodeMap.get(node);
        // shallow "clone" the results, so no downstream manipulation can occur
        const dragResults = assign({}, state.dragResults);
        // we are offering up an accurate delta, so we need to take the last event position and move it to the start so
        // that our deltas are calculated from the last time they are read
        state.start = state.last;
        // reset the delta after we have read, as any future reads should have an empty delta
        state.dragResults.delta = createPosition();
        // clear the start state
        delete state.dragResults.start;
        return dragResults;
    }
}
const controller = new DragController();
export class Drag extends Base {
    constructor() {
        super(...arguments);
        this._boundInvalidate = this.invalidate.bind(this);
    }
    get(key) {
        const node = this.getNode(key);
        // if we don't have a reference to the node yet, return an empty set of results
        if (!node) {
            return emptyResults;
        }
        // otherwise we will ask the controller for our results
        return controller.get(node, this._boundInvalidate);
    }
}
export default Drag;
//# sourceMappingURL=Drag.mjs.map