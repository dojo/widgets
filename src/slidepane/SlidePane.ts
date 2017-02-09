import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/slidePane.css';
import * as animations from '../styles/animations.css';

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
 * @property align			The position of the pane on the screen (Align.left or Align.right)
 * @property open			Determines whether the pane is open or closed
 * @property underlay		Determines whether a semi-transparent background shows behind the pane
 * @property width			Width of the pane in pixels
 * @property onOpen			Called when the pane opens
 * @property onRequestClose	Called when the pane is swiped closed or the underlay is clicked or tapped
 */
export interface SlidePaneProperties extends ThemeableProperties {
	align?: Align;
	open?: boolean;
	underlay?: boolean;
	width?: number;
	onOpen?(): void;
	onRequestClose?(): void;
};

/**
 * The default width of the slide pane
 */
const DEFAULT_WIDTH = 256;

/**
 * The minimum swipe delta in px required to be counted as a swipe and not a touch / click
 */
const SWIPE_THRESHOLD = 5;

@theme(css)
export default class SlidePane extends ThemeableMixin(WidgetBase)<SlidePaneProperties> {
	private content: HTMLElement | null = null;
	private initialX = 0;
	private transform = 0;
	private swiping = false;
	private wasOpen = false;

	onSwipeStart(event: MouseEvent & TouchEvent) {
		event.stopPropagation();
		event.preventDefault();

		this.swiping = true;
		// Cache initial pointer position
		this.initialX = event.type === 'touchstart' ? event.changedTouches[0].screenX : event.pageX;
		// Clear out the last transform applied
		this.transform = 0;
	}

	onSwipeMove(event: MouseEvent & TouchEvent) {
		// Ignore mouse movement when not clicking
		if (!this.swiping) {
			return;
		}

		const {
			width = DEFAULT_WIDTH,
			align = Align.left
		} = this.properties;

		// Current pointer position
		const currentX = event.type === 'touchmove' ? event.changedTouches[0].screenX : event.pageX;
		// Difference between current and initial pointer position
		const delta = align === Align.right ? currentX - this.initialX : this.initialX - currentX;
		// Transform to apply
		this.transform = 100 * delta / width;

		// Prevent pane from sliding past screen edge
		if (delta <= 0) {
			return;
		}

		// Move the pane
		if (this.content) {
			this.content.style.transform = `translateX(${ align === Align.left ? '-' : '' }${ this.transform }%)`;
		}
	}

	onSwipeEnd(event: MouseEvent & TouchEvent) {
		this.swiping = false;

		const {
			width = DEFAULT_WIDTH,
			align = Align.left,
			onRequestClose
		} = this.properties;

		// Current pointer position
		const currentX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.pageX;
		// Difference between current and initial pointer position
		const delta = align === Align.right ? currentX - this.initialX : this.initialX - currentX;

		// If the pane was swiped far enough to close
		if (delta > width / 2) {
			// Cache the transform to apply on next render
			this.transform = 100 * delta / width;
			onRequestClose && onRequestClose();
		}
		// If the underlay was clicked
		else if (Math.abs(delta) < SWIPE_THRESHOLD && (<HTMLElement> event.target).classList.contains(css.underlay)) {
			onRequestClose && onRequestClose();
		}
		// If pane was not swiped far enough to close
		else if (delta > 0) {
			// Animate the pane back open
			this.content && this.content.classList.add(css.slideIn);
		}
	}

	afterCreate(element: HTMLElement) {
		element.addEventListener('transitionend', this.onTransitionEnd!);
		this.content = element;
	}

	onTransitionEnd(event: TransitionEvent) {
		const content = (<HTMLElement> event.target);
		content.classList.remove(css.slideIn, css.slideOut);
		content.style.transform = '';
	}

	render() {
		const {
			open = false,
			align = Align.left,
			underlay = false,
			onOpen
		} = this.properties;

		const contentStyles: {[key: string]: any} = {};

		const contentClasses = [
			css.content,
			open && !this.wasOpen ? css.slideIn : null,
			!open && this.wasOpen ? css.slideOut : null
		];

		const fixedContentClasses = [
			align === Align.left ? css.left : css.right,
			open ? css.open : null
		];

		if (!open && this.wasOpen && this.transform !== 0) {
			// If pane is closing because of swipe
			contentStyles['transform'] = `translateX(${ align === Align.left ? '-' : '' }${ this.transform }%)`;
		}

		open && !this.wasOpen && onOpen && onOpen();
		this.wasOpen = open;

		return v('div', {
			ontouchstart: this.onSwipeStart,
			ontouchmove: this.onSwipeMove,
			ontouchend: this.onSwipeEnd,
			onmousedown: this.onSwipeStart,
			onmousemove: this.onSwipeMove,
			onmouseup: this.onSwipeEnd
		}, [
			open ? v('div', {
				key: 'underlay',
				classes: this.classes(css.underlay).fixed(underlay ? css.underlayVisible : null).get(),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut
			}) : null,
			v('div', {
				key: 'content',
				classes: this.classes(...contentClasses).fixed(...fixedContentClasses).get(),
				styles: contentStyles,
				afterCreate: this.afterCreate
			}, this.children)
		]);
	}
}
