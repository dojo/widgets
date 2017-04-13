import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import * as animations from '../common/styles/animations.m.css';
import * as css from './styles/slidePane.m.css';

/**
 * Enum for left / right alignment
 */
export const enum Align {
	left,
	right
};

/**
 * @type SlidePaneProperties
 *
 * Properties that can be set on a SlidePane component
 *
 * @property align            The position of the pane on the screen (Align.left or Align.right)
 * @property open             Determines whether the pane is open or closed
 * @property underlay         Determines whether a semi-transparent background shows behind the pane
 * @property width            Width of the pane in pixels
 * @property onOpen           Called when the pane opens
 * @property onClose          Called when the pane is swiped closed or the underlay is clicked or tapped
 */
export interface SlidePaneProperties extends ThemeableProperties {
	align?: Align;
	open?: boolean;
	underlay?: boolean;
	width?: number;
	onOpen?(): void;
	onClose?(): void;
};

/**
 * The default width of the slide pane
 */
const DEFAULT_WIDTH = 256;

/**
 * The minimum swipe delta in px required to be counted as a swipe and not a touch / click
 */
const SWIPE_THRESHOLD = 5;

export const SlidePaneBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class SlidePane extends SlidePaneBase<SlidePaneProperties> {
	private _content: HTMLElement | null;
	private _initialX: number;
	private _swiping: boolean;
	private _transform: number;
	private _wasOpen: boolean;

	private _onSwipeStart(event: MouseEvent & TouchEvent) {
		this._swiping = true;
		// Cache initial pointer position
		this._initialX = event.type === 'touchstart' ? event.changedTouches[0].screenX : event.pageX;
		// Clear out the last transform applied
		this._transform = 0;
	}

	private _onSwipeMove(event: MouseEvent & TouchEvent) {
		// Ignore mouse movement when not clicking
		if (!this._swiping) {
			return;
		}

		const {
			width = DEFAULT_WIDTH,
			align = Align.left
		} = this.properties;

		// Current pointer position
		const currentX = event.type === 'touchmove' ? event.changedTouches[0].screenX : event.pageX;
		// Difference between current and initial pointer position
		const delta = align === Align.right ? currentX - this._initialX : this._initialX - currentX;
		// Transform to apply
		this._transform = 100 * delta / width;

		// Prevent pane from sliding past screen edge
		if (delta <= 0) {
			return;
		}

		// Move the pane
		if (this._content) {
			this._content.style.transform = `translateX(${ align === Align.left ? '-' : '' }${ this._transform }%)`;
		}
	}

	private _onSwipeEnd(event: MouseEvent & TouchEvent) {
		this._swiping = false;

		const {
			width = DEFAULT_WIDTH,
			align = Align.left,
			onClose
		} = this.properties;

		// Current pointer position
		const currentX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.pageX;
		// Difference between current and initial pointer position
		const delta = align === Align.right ? currentX - this._initialX : this._initialX - currentX;

		// If the pane was swiped far enough to close
		if (delta > width / 2) {
			// Cache the transform to apply on next render
			this._transform = 100 * delta / width;
			onClose && onClose();
		}
		// If the underlay was clicked
		else if (Math.abs(delta) < SWIPE_THRESHOLD && (<HTMLElement> event.target).classList.contains(css.underlay)) {
			onClose && onClose();
		}
		// If pane was not swiped far enough to close
		else if (delta > 0) {
			// Animate the pane back open
			this._content && this._content.classList.add(css.slideIn);
		}
	}

	private _onTransitionEnd(event: TransitionEvent) {
		const content = (<HTMLElement> event.target);
		content.classList.remove(css.slideIn, css.slideOut);
		content.style.transform = '';
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === 'content') {
			element.addEventListener('transitionend', this._onTransitionEnd);
			this._content = element;
		}
	}

	render(): DNode {
		const {
			align = Align.left,
			onOpen,
			open = false,
			underlay = false,
			width = DEFAULT_WIDTH
		} = this.properties;

		const contentClasses = [
			css.content,
			open && !this._wasOpen ? css.slideIn : null,
			!open && this._wasOpen ? css.slideOut : null
		];

		const fixedContentClasses = [
			align === Align.left ? css.left : css.right,
			open ? css.open : null
		];

		const contentStyles: {[key: string]: any} = {
			width: width + 'px'
		};

		if (!open && this._wasOpen && this._transform) {
			// If pane is closing because of swipe
			contentStyles['transform'] = `translateX(${ align === Align.left ? '-' : '' }${ this._transform }%)`;
		}

		open && !this._wasOpen && onOpen && onOpen();
		this._wasOpen = open;

		return v('div', {
			onmousedown: this._onSwipeStart,
			onmousemove: this._onSwipeMove,
			onmouseup: this._onSwipeEnd,
			ontouchend: this._onSwipeEnd,
			ontouchmove: this._onSwipeMove,
			ontouchstart: this._onSwipeStart,
			classes: this.classes(css.root)
		}, [
			open ? v('div', {
				classes: this.classes(css.underlay).fixed(underlay ? css.underlayVisible : null),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut,
				key: 'underlay'
			}) : null,
			v('div', {
				key: 'content',
				classes: this.classes(...contentClasses).fixed(...fixedContentClasses),
				styles: contentStyles
			}, this.children)
		]);
	}
}
