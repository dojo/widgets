import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v, w } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { diffProperty } from '@dojo/framework/core/decorators/diffProperty';

import * as fixedCss from './styles/split-pane.m.css';
import * as css from '../theme/default/split-pane.m.css';
import { Dimensions } from '@dojo/framework/core/meta/Dimensions';
import { Resize, ContentRect } from '@dojo/framework/core/meta/Resize';
import { GlobalEvent } from '../global-event/index';

/**
 * Direction of this SplitPane
 */
export enum Direction {
	column = 'column',
	row = 'row'
}

export interface SplitPaneProperties extends ThemedProperties {
	/**  */
	collapseWidth?: number;
	/** Orientation of this SplitPane, can be `row` or `column` */
	direction?: Direction;
	/**  */
	onCollapse?(collapsed: boolean): void;
	/** Called when the divider is dragged; should be used to update `size` */
	onResize?(size: number): void;
	/** Size of the primary pane */
	size?: number;
}

const DEFAULT_SIZE = 100;

@theme(css)
export class SplitPane extends ThemedMixin(WidgetBase)<SplitPaneProperties> {
	private _dragging: boolean | undefined;
	private _lastSize?: number;
	private _position = 0;
	private _collapsed = false;
	private _resizeResultOverridden = false;
	private _width = 0;

	@diffProperty('collapseWidth')
	@diffProperty('direction')
	protected collapseWidthDiff(
		oldProperties: SplitPaneProperties,
		{ collapseWidth, direction, onCollapse }: SplitPaneProperties
	) {
		if (
			direction === Direction.row ||
			(collapseWidth && collapseWidth < this._width && this._collapsed)
		) {
			this._collapsed = false;
			this._resizeResultOverridden = true;
			onCollapse && onCollapse(false);
		} else if (collapseWidth && (collapseWidth > this._width && !this._collapsed)) {
			this._collapsed = true;
			this._resizeResultOverridden = true;
			onCollapse && onCollapse(true);
		}
	}

	private _getPosition(event: MouseEvent & TouchEvent) {
		event.stopPropagation();
		const { direction = Direction.column } = this.properties;

		if (direction === Direction.column) {
			return event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
		} else {
			return event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
		}
	}

	private _onDragStart(event: MouseEvent & TouchEvent) {
		event.stopPropagation();
		event.preventDefault();
		this._dragging = true;
		this._position = this._getPosition(event);
	}

	private _onDragMove = (event: MouseEvent & TouchEvent) => {
		event.stopPropagation();
		if (!this._dragging) {
			return;
		}

		const { direction = Direction.column, onResize, size = DEFAULT_SIZE } = this.properties;

		const currentPosition = this._getPosition(event);
		let newSize =
			(this._lastSize === undefined ? size : this._lastSize) +
			currentPosition -
			this._position;

		const rootDimensions = this.meta(Dimensions).get('root');
		const dividerDimensions = this.meta(Dimensions).get('divider');
		const maxSize =
			direction === Direction.column
				? rootDimensions.offset.width - dividerDimensions.offset.width
				: rootDimensions.offset.height - dividerDimensions.offset.height;

		this._lastSize = newSize;

		newSize = newSize < 0 ? 0 : newSize;
		newSize = newSize > maxSize ? maxSize : newSize;

		this._position = currentPosition;

		onResize && onResize(newSize);
	};

	private _onDragEnd = (event: MouseEvent & TouchEvent) => {
		event.stopPropagation();
		this._dragging = false;
		this._lastSize = undefined;
	};

	protected getPaneContent(content: DNode | undefined): DNode[] {
		return content ? [content] : [];
	}

	private _shouldCollapse(dimensions: ContentRect, collapseWidth: number) {
		const { onCollapse, direction } = this.properties;

		if (direction === Direction.row) {
			return false;
		}

		const { width } = dimensions;
		const shouldCollapse = width <= collapseWidth;

		if (shouldCollapse !== this._collapsed) {
			onCollapse && onCollapse(shouldCollapse);
		}

		return shouldCollapse;
	}

	protected render(): DNode {
		const {
			direction = Direction.column,
			size = DEFAULT_SIZE,
			collapseWidth
		} = this.properties;

		const rootDimensions = this.meta(Dimensions).get('root');
		this._width = rootDimensions.size.width;

		if (collapseWidth) {
			const { shouldCollapse } = this.meta(Resize).get('root', {
				shouldCollapse: (dimensions) => {
					this._resizeResultOverridden = false;
					return this._shouldCollapse(dimensions, collapseWidth);
				}
			});

			if (!this._resizeResultOverridden) {
				// update this._collapsed for check in next render
				this._collapsed = shouldCollapse;
			}
		}

		const paneStyles: { [key: string]: string } = {};
		let computedSize = this._collapsed ? 'auto' : `${size}px`;
		paneStyles[direction === Direction.column ? 'width' : 'height'] = computedSize;

		return v(
			'div',
			{
				classes: [
					...this.theme([
						css.root,
						this._collapsed ? css.collapsed : null,
						direction === Direction.row ? css.row : css.column
					]),
					fixedCss.rootFixed,
					direction === Direction.row ? fixedCss.rowFixed : fixedCss.columnFixed,
					this._collapsed ? fixedCss.collapsedFixed : null
				],
				key: 'root'
			},
			[
				w(GlobalEvent, {
					key: 'global',
					window: {
						mouseup: this._onDragEnd,
						mousemove: this._onDragMove,
						touchmove: this._onDragMove
					}
				}),
				v(
					'div',
					{
						classes: [this.theme(css.leading), fixedCss.leadingFixed],
						key: 'leading',
						styles: paneStyles
					},
					this.getPaneContent(this.children[0])
				),
				v('div', {
					classes: [this.theme(css.divider), fixedCss.dividerFixed],
					key: 'divider',
					onmousedown: this._onDragStart,
					ontouchend: this._onDragEnd,
					ontouchstart: this._onDragStart
				}),
				v(
					'div',
					{
						classes: [this.theme(css.trailing), fixedCss.trailingFixed],
						key: 'trailing'
					},
					this.getPaneContent(this.children[1])
				)
			]
		);
	}
}

export default SplitPane;
