import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import * as animations from '../common/styles/animations.m.css';
import * as css from './styles/slidePane.m.css';
import * as iconCss from '../common/styles/icons.m.css';
import uuid from '@dojo/core/uuid';

/**
 * Enum for left / right alignment
 */
export const enum Align {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
};

/**
 * @type SlidePaneProperties
 *
 * Properties that can be set on a SlidePane component
 *
 * @property align            The position of the pane on the screen
 * @property closeText        Hidden text used by screen readers to display for the close button
 * @property onOpen           Called when the pane opens
 * @property onRequestClose   Called when the pane is swiped closed or the underlay is clicked or tapped
 * @property open             Determines whether the pane is open or closed
 * @property title            Title to display in the pane
 * @property underlay         Determines whether a semi-transparent background shows behind the pane
 * @property width            Width of the pane in pixels
 */
export interface SlidePaneProperties extends ThemeableProperties {
	align?: Align;
	closeText?: string;
	onOpen?(): void;
	onRequestClose?(): void;
	open?: boolean;
	title?: string;
	underlay?: boolean;
	width?: number;
};

/**
 * The default width of the slide pane
 */
const DEFAULT_WIDTH = 320;

/**
 * The minimum swipe delta in px required to be counted as a swipe and not a touch / click
 */
const SWIPE_THRESHOLD = 5;

const enum Plane {
	x,
	y
};

export const SlidePaneBase = ThemeableMixin(WidgetBase);

@theme(css)
@theme(iconCss)
export default class SlidePane extends SlidePaneBase<SlidePaneProperties> {
	private _content: HTMLElement;
	private _initialPosition: number;
	private _slideIn: boolean;
	private _swiping: boolean;
	private _titleId = uuid();
	private _transform: number;
	private _wasOpen: boolean;

	get plane() {
		const { align = Align.left } = this.properties;
		return align === Align.left || align === Align.right ? Plane.x : Plane.y;
	}

	private _getDelta(event: MouseEvent & TouchEvent, eventType: string) {
		const { align = Align.left } = this.properties;

		if (this.plane === Plane.x) {
			const currentX = event.type === eventType ? event.changedTouches[0].screenX : event.pageX;
			return align === Align.right ? currentX - this._initialPosition : this._initialPosition - currentX;
		}
		else {
			const currentY = event.type === eventType ? event.changedTouches[0].screenY : event.pageY;
			return align === Align.bottom ? currentY - this._initialPosition : this._initialPosition - currentY;
		}
	}

	private _onCloseClick() {
		const { onRequestClose } = this.properties;
		onRequestClose && onRequestClose();
	}

	private _onSwipeStart(event: MouseEvent & TouchEvent) {
		this._swiping = true;
		// Cache initial pointer position
		if (this.plane === Plane.x) {
			this._initialPosition = event.type === 'touchstart' ? event.changedTouches[0].screenX : event.pageX;
		}
		else {
			this._initialPosition = event.type === 'touchstart' ? event.changedTouches[0].screenY : event.pageY;
		}

		// Clear out the last transform applied
		this._transform = 0;
	}

	private _onSwipeMove(event: MouseEvent & TouchEvent) {
		// Ignore mouse movement when not clicking
		if (!this._swiping) {
			return;
		}

		const {
			align = Align.left,
			width = DEFAULT_WIDTH
		} = this.properties;

		const delta = this._getDelta(event, 'touchmove');

		// Transform to apply
		this._transform = 100 * delta / width;

		// Prevent pane from sliding past screen edge
		if (delta <= 0) {
			return;
		}

		// Move the pane
		if (this.plane === Plane.x) {
			this._content.style.transform = `translateX(${ align === Align.left ? '-' : '' }${ this._transform }%)`;
		}
		else {
			this._content.style.transform = `translateY(${ align === Align.top ? '-' : '' }${ this._transform }%)`;
		}
	}

	private _onSwipeEnd(event: MouseEvent & TouchEvent) {
		this._swiping = false;

		const {
			onRequestClose,
			width = DEFAULT_WIDTH
		} = this.properties;

		const delta = this._getDelta(event, 'touchend');

		// If the pane was swiped far enough to close
		if (delta > width / 2) {
			// Cache the transform to apply on next render
			this._transform = 100 * delta / width;
			onRequestClose && onRequestClose();
		}
		// If the underlay was clicked
		else if (Math.abs(delta) < SWIPE_THRESHOLD && (!this._content || !this._content.contains(event.target as HTMLElement))) {
			onRequestClose && onRequestClose();
		}
		// If pane was not swiped far enough to close
		else if (delta > 0) {
			// Animate the pane back open
			this._slideIn = true;
			this.invalidate();
		}
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === 'content') {
			element.addEventListener('transitionend', this.invalidate.bind(this));
			this._content = element;
		}
	}

	render(): DNode {
		const {
			align = Align.left,
			closeText = 'close pane',
			onOpen,
			open = false,
			title = '',
			underlay = false,
			width = DEFAULT_WIDTH
		} = this.properties;

		const alignCss: {[key: string]: any} = css;

		const contentClasses = [
			css.pane,
			alignCss[align],
			open ? css.open : null,
			this._slideIn || (open && !this._wasOpen) ? css.slideIn : null,
			!open && this._wasOpen ? css.slideOut : null
		];

		const fixedContentClasses = [
			css.paneFixed,
			open ? css.openFixed : null,
			alignCss[`${align}Fixed`],
			this._slideIn || (open && !this._wasOpen) ? css.slideInFixed : null,
			!open && this._wasOpen ? css.slideOutFixed : null
		];

		const contentStyles: {[key: string]: any} = {
			transform: '',
			width: this.plane === Plane.x ? `${ width }px` : null,
			height: this.plane === Plane.y ? `${ width }px` : null
		};

		if (!open && this._wasOpen && this._transform) {
			// If pane is closing because of swipe
			if (this.plane === Plane.x) {
				contentStyles['transform'] = `translateX(${ align === Align.left ? '-' : '' }${ this._transform }%)`;
			}
			else {
				contentStyles['transform'] = `translateY(${ align === Align.top ? '-' : '' }${ this._transform }%)`;
			}
		}
		else if (this._slideIn && this._content) {
			this._content.style.transform = '';
		}

		open && !this._wasOpen && onOpen && onOpen();
		this._wasOpen = open;
		this._slideIn = false;

		return v('div', {
			'aria-labelledby': this._titleId,
			classes: this.classes(css.root),
			onmousedown: this._onSwipeStart,
			onmousemove: this._onSwipeMove,
			onmouseup: this._onSwipeEnd,
			ontouchend: this._onSwipeEnd,
			ontouchmove: this._onSwipeMove,
			ontouchstart: this._onSwipeStart
		}, [
			open ? v('div', {
				classes: this.classes(underlay ? css.underlayVisible : null).fixed(css.underlay),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut,
				key: 'underlay'
			}) : null,
			v('div', {
				key: 'content',
				classes: this.classes(...contentClasses).fixed(...fixedContentClasses),
				styles: contentStyles
			}, [
				title ? v('div', {
					classes: this.classes(css.title),
					key: 'title'
				}, [
					v('div', { id: this._titleId }, [ title ]),
					v('button', {
						classes: this.classes(css.close),
						onclick: this._onCloseClick
					}, [
						closeText,
						v('i', { classes: this.classes(iconCss.icon, iconCss.closeIcon),
							role: 'presentation', 'aria-hidden': 'true'
						})
					])
				]) : null,
				v('div', { classes: this.classes(css.content) }, this.children)
			])
		]);
	}
}
