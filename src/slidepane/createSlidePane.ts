import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import WeakMap from '@dojo/shim/WeakMap';

import * as css from './styles/slidePane.css';
import * as animations from '../styles/animations.css';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';

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
export interface SlidePaneProperties extends WidgetProperties {
	align?: Align;
	open?: boolean;
	underlay?: boolean;
	width?: number;
	onOpen?(): void;
	onRequestClose?(): void;
};

/**
 * @type SlidePane
 *
 * A SlidePane component
 *
 * @property onSwipeStart		Event handler for when a touch or mouse press starts on the pane or underlay
 * @property onSwipeMove		Event handler for when the pane or underlay is dragged or swiped
 * @property onSwipeEnd			Event handler for when a touch or mouse press ends on the pane or underlay
 * @property afterCreate		Called after the pane is rendered as DOM
 * @property onTransitionEnd	Event handler for when the pane finishes any animation
 */
export type SlidePane = Widget<SlidePaneProperties> & ThemeableMixin & {
	onSwipeStart(event: MouseEvent & TouchEvent): void;
	onSwipeMove(event: MouseEvent & TouchEvent): void;
	onSwipeEnd(event: MouseEvent & TouchEvent): void;
	afterCreate(element: HTMLElement): void;
	onTransitionEnd(event: TransitionEvent): void;
};

/**
 * @type SlidePaneFactory
 *
 * Widget factory that creates a SlidePane component
 */
export interface SlidePaneFactory extends WidgetFactory<SlidePane, SlidePaneProperties> { };

interface InternalState {
	content: HTMLElement | null;
	initialX: number;
	transform: number;
	swiping: boolean;
	wasOpen: boolean;
};

const internalStateMap = new WeakMap<SlidePane, InternalState>();

/**
 * The default width of the slide pane
 */
const DEFAULT_WIDTH = 256;

/**
 * The minimum swipe delta in px required to be counted as a swipe and not a touch / click
 */
const SWIPE_THRESHOLD = 5;

const createSlidePane: SlidePaneFactory = createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseClasses: css,

		onSwipeStart(this: SlidePane, event: MouseEvent & TouchEvent) {
			event.stopPropagation();
			event.preventDefault();

			const state = internalStateMap.get(this);

			state.swiping = true;
			// Cache initial pointer position
			state.initialX = event.type === 'touchstart' ? event.changedTouches[0].screenX : event.pageX;
			// Clear out the last transform applied
			state.transform = 0;

			internalStateMap.set(this, state);
		},

		onSwipeMove(this: SlidePane, event: MouseEvent & TouchEvent) {
			const state = internalStateMap.get(this);

			// Ignore mouse movement when not clicking
			if (!state.swiping) {
				return;
			}

			const {
				width = DEFAULT_WIDTH,
				align = Align.left
			} = this.properties;

			// Current pointer position
			const currentX = event.type === 'touchmove' ? event.changedTouches[0].screenX : event.pageX;
			// Difference between current and initial pointer position
			const delta = align === Align.right ? currentX - state.initialX : state.initialX - currentX;
			// Transform to apply
			state.transform = 100 * delta / width;

			internalStateMap.set(this, state);

			// Prevent pane from sliding past screen edge
			if (delta <= 0) {
				return;
			}

			// Move the pane
			if (state.content) {
				state.content.style.transform = `translateX(${ align === Align.left ? '-' : '' }${ state.transform }%)`;
			}
		},

		onSwipeEnd(this: SlidePane, event: MouseEvent & TouchEvent) {
			const state = internalStateMap.get(this);
			state.swiping = false;

			const {
				width = DEFAULT_WIDTH,
				align = Align.left,
				onRequestClose
			} = this.properties;

			// Current pointer position
			const currentX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.pageX;
			// Difference between current and initial pointer position
			const delta = align === Align.right ? currentX - state.initialX : state.initialX - currentX;

			// If the pane was swiped far enough to close
			if (delta > width / 2) {
				// Cache the transform to apply on next render
				state.transform = 100 * delta / width;
				internalStateMap.set(this, state);
				onRequestClose && onRequestClose();
			}
			// If the underlay was clicked
			else if (Math.abs(delta) > SWIPE_THRESHOLD && (<HTMLElement> event.target).classList.contains(css.underlay)) {
				internalStateMap.set(this, state);
				onRequestClose && onRequestClose();
			}
			// If pane was not swiped far enough to close
			else if (delta > 0) {
				// Animate the pane back open
				state.content && state.content.classList.add(css.slideIn);
				internalStateMap.set(this, state);
			}
		},

		afterCreate(this: SlidePane, element: HTMLElement) {
			const state = internalStateMap.get(this);
			element.addEventListener('transitionend', this.onTransitionEnd!);
			state.content = element;
			internalStateMap.set(this, state);
		},

		onTransitionEnd(this: SlidePane, event: TransitionEvent) {
			const content = (<HTMLElement> event.target);
			content.classList.remove(css.slideIn, css.slideOut);
			content.style.transform = '';
		},

		render(this: SlidePane): DNode {
			const state = internalStateMap.get(this);
			const {
				open = false,
				align = Align.left,
				underlay = false,
				onOpen
			} = this.properties;

			const contentStyles: {[key: string]: any} = {};

			const contentClasses = [
				css.content,
				open && !state.wasOpen ? css.slideIn : null,
				!open && state.wasOpen ? css.slideOut : null
			];

			const fixedContentClasses = [
				align === Align.left ? css.left : css.right,
				open ? css.open : null
			];

			if (!open && state.wasOpen && state.transform !== 0) {
				// If pane is closing because of swipe
				contentStyles['transform'] = `translateX(${ align === Align.left ? '-' : '' }${ state.transform }%)`;
			}

			open && !state.wasOpen && onOpen && onOpen();
			state.wasOpen = open;
			internalStateMap.set(this, state);

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
	},
	initialize: function(instance) {
		internalStateMap.set(instance, {
			content: null,
			initialX: 0,
			transform: 0,
			swiping: false,
			wasOpen: false
		});
	}
});

export default createSlidePane;
