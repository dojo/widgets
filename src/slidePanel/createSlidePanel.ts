import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import WeakMap from '@dojo/shim/WeakMap';

import * as css from './styles/slidePanel.css';
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
 * @type SlidePanelProperties
 *
 * Properties that can be set on a SlidePanel component
 *
 * @property align			The position of the panel on the screen (Align.left or Align.right)
 * @property open			Determines whether the panel is open or closed
 * @property underlay		Determines whether a semi-transparent background shows behind the panel
 * @property width			Width of the panel in pixels
 * @property onOpen			Called when the panel opens
 * @property onRequestClose	Called when the panel is swiped closed or the underlay is clicked or tapped
 */
export interface SlidePanelProperties extends WidgetProperties {
	align?: Align;
	open?: boolean;
	underlay?: boolean;
	width?: number;
	onOpen?(): void;
	onRequestClose?(): void;
};

/**
 * @type SlidePanel
 *
 * A SlidePanel component
 *
 * @property onSwipeStart		Event handler for when a touch or mouse press starts on the panel or underlay
 * @property onSwipeMove		Event handler for when the panel or underlay is dragged or swiped
 * @property onSwipeEnd			Event handler for when a touch or mouse press ends on the panel or underlay
 * @property afterCreate		Called after the panel is rendered as DOM
 * @property onTransitionEnd	Event handler for when the panel finishes any animation
 */
export type SlidePanel = Widget<SlidePanelProperties> & ThemeableMixin & {
	onSwipeStart(event: MouseEvent & TouchEvent): void;
	onSwipeMove(event: MouseEvent & TouchEvent): void;
	onSwipeEnd(event: MouseEvent & TouchEvent): void;
	afterCreate(element: HTMLElement): void;
	onTransitionEnd(event: TransitionEvent): void;
};

/**
 * @type SlidePanelFactory
 *
 * Widget factory that creates a SlidePanel component
 */
export interface SlidePanelFactory extends WidgetFactory<SlidePanel, SlidePanelProperties> { };

interface InternalState {
	content: HTMLElement | null;
	initialX: number;
	transform: number;
	swiping: boolean;
	wasOpen: boolean;
};

const internalStateMap = new WeakMap<SlidePanel, InternalState>();

const DEFAULT_WIDTH = 256;

const createSlidePanel: SlidePanelFactory = createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseClasses: css,

		onSwipeStart(this: SlidePanel, event: MouseEvent & TouchEvent) {
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

		onSwipeMove(this: SlidePanel, event: MouseEvent & TouchEvent) {
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

			// Prevent panel from sliding past screen edge
			if (delta <= 0) {
				return;
			}

			// Move the panel
			if (state.content) {
				state.content.style.transform = `translateX(${ align === Align.left ? '-' : '' }${ state.transform }%)`;
			}
		},

		onSwipeEnd(this: SlidePanel, event: MouseEvent & TouchEvent) {
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

			// If the panel was swiped far enough to close
			if (delta > width / 2) {
				// Cache the transform to apply on next render
				state.transform = 100 * delta / width;
				internalStateMap.set(this, state);
				onRequestClose && onRequestClose();
			}
			// If the underlay was clicked
			else if (delta > -5 && delta < 5 && (<HTMLElement> event.target).classList.contains(css.underlay)) {
				internalStateMap.set(this, state);
				onRequestClose && onRequestClose();
			}
			// If panel was not swiped far enough to close
			else if (delta > 0) {
				// Animate the panel back open
				state.content && state.content.classList.add(css.slideIn);
				internalStateMap.set(this, state);
			}
		},

		afterCreate(this: SlidePanel, element: HTMLElement) {
			const state = internalStateMap.get(this);
			element.addEventListener('transitionend', this.onTransitionEnd!);
			state.content = element;
			internalStateMap.set(this, state);
		},

		onTransitionEnd(this: SlidePanel, event: TransitionEvent) {
			const content = (<HTMLElement> event.target);
			content.classList.remove(css.slideIn, css.slideOut);
			content.style.transform = '';
		},

		render(this: SlidePanel): DNode {
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
				align === Align.left ? css.left : null,
				open ? css.open : null,
				open && !state.wasOpen ? css.slideIn : null,
				!open && state.wasOpen ? css.slideOut : null
			];

			const underlayClasses = [
				css.underlay,
				underlay ? css.underlayVisible : null
			];

			if (!open && state.wasOpen && state.transform !== 0) {
				// If panel is closing because of swipe
				contentStyles['transform'] = `translateX(${ align === Align.left ? '-' : '' }${ state.transform }%)`;
			}

			const content = v('div', {
				key: 'content',
				classes: this.classes(...contentClasses).get(),
				styles: contentStyles,
				afterCreate: this.afterCreate
			}, this.children);

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
			}, open ? [
				v('div', {
					key: 'underlay',
					classes: this.classes(...underlayClasses).get(),
					enterAnimation: animations.fadeIn,
					exitAnimation: animations.fadeOut
				}),
				content
			] : [ content ]);
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

export default createSlidePanel;
