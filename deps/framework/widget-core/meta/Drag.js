(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../core/lang", "../../shim/global", "../../shim/object", "../../shim/WeakMap", "./Base"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var lang_1 = require("../../core/lang");
    var global_1 = require("../../shim/global");
    var object_1 = require("../../shim/object");
    var WeakMap_1 = require("../../shim/WeakMap");
    var Base_1 = require("./Base");
    function createNodeData(invalidate) {
        return {
            dragResults: lang_1.deepAssign({}, emptyResults),
            invalidate: invalidate,
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
    var emptyResults = Object.freeze({
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
    var DragController = /** @class */ (function () {
        function DragController() {
            var _this = this;
            this._nodeMap = new WeakMap_1.default();
            this._dragging = undefined;
            this._onDragStart = function (event) {
                var _dragging = _this._dragging;
                if (!event.isPrimary && _dragging) {
                    // we have a second touch going on here, while we are dragging, so we aren't really dragging, so we
                    // will close this down
                    var state = _this._nodeMap.get(_dragging);
                    state.dragResults.isDragging = false;
                    state.invalidate();
                    _this._dragging = undefined;
                    return;
                }
                if (event.button !== 0) {
                    // it isn't the primary button that is being clicked, so we will ignore this
                    return;
                }
                var data = _this._getData(event.target);
                if (data) {
                    var state = data.state, target = data.target;
                    _this._dragging = target;
                    state.last = state.start = getPositionMatrix(event);
                    state.dragResults.delta = createPosition();
                    state.dragResults.start = lang_1.deepAssign({}, state.start);
                    state.dragResults.isDragging = true;
                    state.invalidate();
                    event.preventDefault();
                    event.stopPropagation();
                } // else, we are ignoring the event
            };
            this._onDrag = function (event) {
                var _dragging = _this._dragging;
                if (!_dragging) {
                    return;
                }
                // state cannot be unset, using ! operator
                var state = _this._nodeMap.get(_dragging);
                state.last = getPositionMatrix(event);
                state.dragResults.delta = getDelta(state.start, state.last);
                if (!state.dragResults.start) {
                    state.dragResults.start = lang_1.deepAssign({}, state.start);
                }
                state.invalidate();
                event.preventDefault();
                event.stopPropagation();
            };
            this._onDragStop = function (event) {
                var _dragging = _this._dragging;
                if (!_dragging) {
                    return;
                }
                // state cannot be unset, using ! operator
                var state = _this._nodeMap.get(_dragging);
                state.last = getPositionMatrix(event);
                state.dragResults.delta = getDelta(state.start, state.last);
                if (!state.dragResults.start) {
                    state.dragResults.start = lang_1.deepAssign({}, state.start);
                }
                state.dragResults.isDragging = false;
                state.invalidate();
                _this._dragging = undefined;
                event.preventDefault();
                event.stopPropagation();
            };
            var win = global_1.default.window;
            win.addEventListener('pointerdown', this._onDragStart);
            // Use capture phase, to determine the right node target, as it will be top down versus bottom up
            win.addEventListener('pointermove', this._onDrag, true);
            win.addEventListener('pointerup', this._onDragStop, true);
        }
        DragController.prototype._getData = function (target) {
            if (this._nodeMap.has(target)) {
                return { state: this._nodeMap.get(target), target: target };
            }
            if (target.parentElement) {
                return this._getData(target.parentElement);
            }
        };
        DragController.prototype.get = function (node, invalidate) {
            var _nodeMap = this._nodeMap;
            // first time we see a node, we will initialize its state and properties
            if (!_nodeMap.has(node)) {
                _nodeMap.set(node, createNodeData(invalidate));
                initNode(node);
                return emptyResults;
            }
            var state = _nodeMap.get(node);
            // shallow "clone" the results, so no downstream manipulation can occur
            var dragResults = object_1.assign({}, state.dragResults);
            // we are offering up an accurate delta, so we need to take the last event position and move it to the start so
            // that our deltas are calculated from the last time they are read
            state.start = state.last;
            // reset the delta after we have read, as any future reads should have an empty delta
            state.dragResults.delta = createPosition();
            // clear the start state
            delete state.dragResults.start;
            return dragResults;
        };
        return DragController;
    }());
    var controller = new DragController();
    var Drag = /** @class */ (function (_super) {
        tslib_1.__extends(Drag, _super);
        function Drag() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._boundInvalidate = _this.invalidate.bind(_this);
            return _this;
        }
        Drag.prototype.get = function (key) {
            var node = this.getNode(key);
            // if we don't have a reference to the node yet, return an empty set of results
            if (!node) {
                return emptyResults;
            }
            // otherwise we will ask the controller for our results
            return controller.get(node, this._boundInvalidate);
        };
        return Drag;
    }(Base_1.Base));
    exports.Drag = Drag;
    exports.default = Drag;
});
//# sourceMappingURL=Drag.js.map