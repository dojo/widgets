import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { createHandle } from '@dojo/core/lang';
import { debounce } from '@dojo/core/util';
import { observeViewport } from '../common/util';

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
 * @property closeable          Determines whether the dialog can be closed
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
	private _lastSize: number;
	private _position: number;
	private _root: HTMLElement;

	constructor() {
		/* istanbul ignore next: disregard transpiled `super`'s "else" block */
		super();

		/**
		 * `mouseup` isn't triggered when a user's cursor leaves div.root, so
		 * global handlers are need to listen to the document instead. SplitPane
		 * uses a `_dragging` flag so no handlers will be erroneously executed
		 * if a user isn't actually resizing this SplitPane instance.
		 */
		document.addEventListener('mouseup', this._onDragEnd.bind(this));
		document.addEventListener('mousemove', this._onDragMove.bind(this));
		document.addEventListener('touchmove', this._onDragMove.bind(this));

		const viewportSubscription = observeViewport({
			next: debounce(this._onResize.bind(this), 200)
		});

		this.own(createHandle(() => {
			viewportSubscription.unsubscribe();
		}));
	}

	private _getPosition(event: MouseEvent & TouchEvent) {
		const { direction = Direction.row } = this.properties;

		if (direction === Direction.row) {
			return event.type === 'touchstart' ? event.changedTouches[0].clientX : event.clientX;
		}
		else {
			return event.type === 'touchstart' ? event.changedTouches[0].clientY : event.clientY;
		}
	}

	private _onDragStart(event: MouseEvent & TouchEvent) {
		this._dragging = true;
		this._position = this._getPosition(event);
	}

	private _onDragMove(event: MouseEvent & TouchEvent) {
		if (!this._dragging) {
			return;
		}

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
	}

	private _onResize() {
		const {
			direction = Direction.row,
			size = DEFAULT_SIZE,
			onResize
		} = this.properties;

		const rootSize = direction === Direction.row ? this._root.offsetWidth : this._root.offsetHeight;
		if (size > rootSize) {
			onResize && onResize(rootSize);
		}
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
			leading = null,
			size = DEFAULT_SIZE,
			trailing = null,
			direction = Direction.row
		} = this.properties;

		const styles: {[key: string]: string} = {};
		styles[direction === Direction.row ? 'width' : 'height'] = `${size}px`;

		return v('div', {
			classes: this.classes(
				css.root,
				direction === Direction.column ? css.column : css.row
			),
			key: 'root'
		}, [
			v('div', {
				classes: this.classes(css.leading),
				key: 'leading',
				styles
			}, [ leading ]),
			v('div', {
				key: 'divider',
				classes: this.classes(css.divider),
				onmousedown: this._onDragStart,
				ontouchstart: this._onDragStart,
				ontouchend: this._onDragEnd
			}),
			v('div', {
				key: 'trailing',
				classes: this.classes(css.trailing)
			}, [ trailing ])
		]);
	}
}
