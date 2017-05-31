import { createHandle } from '@dojo/core/lang';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import * as css from './styles/splitPane.m.css';

/**
 * Direction of this SplitPane
 */
export const enum Direction {
	column,
	row
};

/**
 * @type SplitPaneProperties
 *
 * Properties that can be set on a SplitPane component
 *
 * @property direction      Orientation of this SplitPane, can be `row` or `column`
 * @property leading        Content to show in the primary pane
 * @property onResize       Called when the divider is dragged; should be used to update `size`
 * @property size           Size of the primary pane
 * @property trailing       Content to show in the secondary pane
 */
export interface SplitPaneProperties extends ThemeableProperties {
	direction?: Direction;
	leading?: DNode;
	onResize?(size: number): void;
	size?: number;
	trailing?: DNode;
};

export const SplitPaneBase = ThemeableMixin(WidgetBase);

const DEFAULT_SIZE = 100;

@theme(css)
export default class SplitPane extends SplitPaneBase<SplitPaneProperties> {
	private _divider: HTMLElement;
	private _dragging: boolean;
	private _lastSize?: number;
	private _position: number;
	private _root: HTMLElement;
	private _boundHandlers: any[];

	constructor() {
		/* istanbul ignore next: disregard transpiled `super`'s "else" block */
		super();

		/**
		 * `mouseup` and other events aren't triggered when a user's cursor leaves div.root, so
		 * global handlers are need to listen to the document instead. SplitPane
		 * uses a `_dragging` flag so no handlers will be erroneously executed
		 * if a user isn't actually resizing this SplitPane instance.
		 */
		this._boundHandlers = [];
		[
			{ event: 'mouseup', func: this._onDragEnd.bind(this) },
			{ event: 'mousemove', func: this._onDragMove.bind(this) },
			{ event: 'touchmove', func: this._onDragMove.bind(this) }
		].forEach(object => {
			document.addEventListener(object.event, object.func);
			this._boundHandlers.push(object);
		});

		this.own(createHandle(() => {
			this._boundHandlers.forEach(object => document.removeEventListener(object.event, object.func));
		}));
	}

	private _deselect() {
		const selection = window.getSelection();
		selection.removeAllRanges();
	}

	private _getPosition(event: MouseEvent & TouchEvent) {
		const { direction = Direction.row } = this.properties;

		if (direction === Direction.row) {
			return event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
		}
		else {
			return event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
		}
	}

	private _onDragStart(event: MouseEvent & TouchEvent) {
		this._dragging = true;
		this._position = this._getPosition(event);
		this._deselect();
	}

	private _onDragMove(event: MouseEvent & TouchEvent) {
		if (!this._dragging) {
			return;
		}

		this._deselect();

		const {
			direction = Direction.row,
			onResize,
			size = DEFAULT_SIZE
		} = this.properties;

		const currentPosition = this._getPosition(event);
		let newSize = (this._lastSize === undefined ? size : this._lastSize) + currentPosition - this._position;

		const maxSize = direction === Direction.row ?
			this._root.offsetWidth - this._divider.offsetWidth :
			this._root.offsetHeight - this._divider.offsetHeight;

		this._lastSize = newSize;

		newSize = newSize < 0 ? 0 : newSize;
		newSize = newSize > maxSize ? maxSize : newSize;

		this._position = currentPosition;

		onResize && onResize(newSize);
	}

	private _onDragEnd(event: MouseEvent & TouchEvent) {
		this._dragging = false;
		this._lastSize = undefined;
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === 'root') {
			this._root = element;
		}
		if (key === 'divider') {
			this._divider = element;
		}
	}

	render(): DNode {
		const {
			direction = Direction.row,
			leading = null,
			size = DEFAULT_SIZE,
			trailing = null
		} = this.properties;

		const styles: {[key: string]: string} = {};
		styles[direction === Direction.row ? 'width' : 'height'] = `${size}px`;

		return v('div', {
			classes: this.classes(
				direction === Direction.column ? css.column : css.row
			).fixed(
				css.root,
				direction === Direction.column ? css.column : css.row
			),
			key: 'root'
		}, [
			v('div', {
				classes: this.classes().fixed(
					css.leading
				),
				key: 'leading',
				styles
			}, [ leading ]),
			v('div', {
				classes: this.classes(
					css.divider
				).fixed(
					css.divider
				),
				key: 'divider',
				onmousedown: this._onDragStart,
				ontouchend: this._onDragEnd,
				ontouchstart: this._onDragStart
			}),
			v('div', {
				classes: this.classes().fixed(
					css.trailing
				),
				key: 'trailing'
			}, [ trailing ])
		]);
	}
}
