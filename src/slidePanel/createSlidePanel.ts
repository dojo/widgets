import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import WeakMap from '@dojo/shim/WeakMap';

import * as css from './styles/slidePanel.css';
import * as animations from '../styles/animations.css';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';

/**
 * @type SlidePanelProperties
 *
 * Properties that can be set on a SlidePanel component
 *
 * @property	{string?}		align			The position of the panel on the screen ('left' or 'right')
 * @property	{boolean?}		open			Determines whether the panel is open or closed
 * @property	{boolean?}		underlay		Determines whether a semi-transparent background shows behind the panel
 * @property	{number?}		width			Width of the panel in pixels
 * @property	{Function?}		onOpen			Called when the panel opens
 * @property	{Function?}		onRequestClose	Called when the panel is swiped closed or the underlay is clicked or tapped
 */
export interface SlidePanelProperties extends WidgetProperties {
	align?: string;
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
 * @property	{Function}		onSwipeStart		Event handler for when a touch or mouse press starts on the panel or underlay
 * @property	{Function}		onSwipeMove			Event handler for when the panel or underlay is dragged or swiped
 * @property	{Function}		onSwipeEnd			Event handler for when a touch or mouse press ends on the panel or underlay
 * @property	{Function}		afterCreate			Called after the panel is rendered as DOM
 * @property	{Function}		onTransitionEnd		Event handler for when the panel finishes any animation
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
				width = 256,
				align = 'left'
			} = this.properties;

			// Current pointer position
			const currentX = event.type === 'touchmove' ? event.changedTouches[0].screenX : event.pageX;
			// Difference between current and initial pointer position
			const delta = align === 'right' ? currentX - state.initialX : state.initialX - currentX;
			// Transform to apply
			state.transform = 100 * delta / width;

			internalStateMap.set(this, state);

			// Prevent panel from sliding past screen edge
			if (delta <= 0) {
				return;
			}

			// Move the panel
			if (state.content) {
				state.content.style.transform =  `translateX(${ align === 'left' ? '-' : '' }${ state.transform }%)`;
			}
		},

		onSwipeEnd(this: SlidePanel, event: MouseEvent & TouchEvent) {
			const state = internalStateMap.get(this);
			state.swiping = false;

			const {
				width = 256,
				align = 'left',
				onRequestClose
			} = this.properties;

			// Current pointer position
			const currentX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.pageX;
			// Difference between current and initial pointer position
			const delta = align === 'right' ? currentX - state.initialX : state.initialX - currentX;

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
				align = 'left',
				underlay = false,
				onOpen
			} = this.properties;

			const styles: {[key: string]: any} = {};
			const classes = [css.content];

			// If panel is opening
			if (open && !state.wasOpen) {
				classes.push(css.slideIn);
			}
			// If panel is closing
			else if (!open && state.wasOpen) {
				classes.push(css.slideOut);
				// If panel is closing because of swipe
				if (state.transform !== 0) {
					styles['transform'] = `translateX(${ align === 'left' ? '-' : '' }${ state.transform }%)`;
				}
			}

			const content = v('div', {
				key: 'content',
				classes: this.classes(...classes).get(),
				styles: styles,
				afterCreate: this.afterCreate
			}, this.children);

			open && !state.wasOpen && onOpen && onOpen();
			state.wasOpen = open;
			internalStateMap.set(this, state);

			return v('div', {
				'data-open': String(open),
				'data-underlay': String(underlay),
				'data-align': align,
				ontouchstart: this.onSwipeStart,
				ontouchmove: this.onSwipeMove,
				ontouchend: this.onSwipeEnd,
				onmousedown: this.onSwipeStart,
				onmousemove: this.onSwipeMove,
				onmouseup: this.onSwipeEnd
			}, open ? [
				v('div', {
					key: 'underlay',
					classes: this.classes(css.underlay).get(),
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
