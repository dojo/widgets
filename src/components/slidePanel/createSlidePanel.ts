import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/slidePanel.css';
import * as animations from '../../styles/animations.css';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';

export interface SlidePanelProperties extends WidgetProperties {
	align?: string;
	open?: boolean;
	underlay?: boolean;
	onOpen?(): void;
	onRequestClose?(): void;
};

export type SlidePanel = Widget<SlidePanelProperties> & ThemeableMixin & {
	onSwipeStart?(event: TouchEvent & MouseEvent): void;
	onSwipeMove?(event: TouchEvent & MouseEvent): void;
	onSwipeEnd?(event: TouchEvent & MouseEvent): void;
};

export interface SlidePanelFactory extends WidgetFactory<SlidePanel, SlidePanelProperties> { };

let content: HTMLElement;
let contentWidth = 0;
let initialX = 0;
let lastX = 0;
let swiping = false;
let wasOpen = false;

function afterCreate(this: SlidePanel, element: HTMLElement) {
	element.addEventListener('transitionend', onTransitionEnd.bind(this));
	content = element;
}

function onTransitionEnd(this: SlidePanel, event: TransitionEvent) {
	const content = (<HTMLElement> event.target);
	content.classList.remove(css.slideIn, css.slideOut);
	content.style[this.properties.align === 'right' ? 'right' : 'left'] = '';
}

const createSlidePanel: SlidePanelFactory = createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseClasses: css,

		onSwipeStart(this: SlidePanel, event: TouchEvent & MouseEvent) {
			event.stopPropagation();
			event.preventDefault();

			contentWidth = content.clientWidth;
			initialX = event.type === 'touchstart' ? event.changedTouches[0].screenX : event.pageX;
			lastX = 0;
			swiping = true;
		},

		onSwipeMove(this: SlidePanel, event: TouchEvent & MouseEvent) {
			// Ignore mouse movement when not clicking
			if (!swiping) {
				return;
			}

			let currentX = event.type === 'touchmove' ? event.changedTouches[0].screenX : event.pageX;
			let delta = this.properties.align === 'right' ? currentX - initialX : initialX - currentX;

			// Prevent panel from sliding past screen edge
			if (delta <= 0) {
				return;
			}

			content.style[this.properties.align === 'right' ? 'right' : 'left'] = -delta + 'px';
		},

		onSwipeEnd(this: SlidePanel, event: TouchEvent & MouseEvent) {
			swiping = false;

			let currentX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.pageX;
			let delta = this.properties.align === 'right' ? currentX - initialX : initialX - currentX;

			// If the panel was swiped far enough to close
			if (delta > contentWidth / 2) {
				lastX = Number(content.style[this.properties.align === 'right' ? 'right' : 'left']!.replace(/px$/, ''));
				lastX = lastX === 0 ? 1 : lastX;
				this.properties.onRequestClose && this.properties.onRequestClose();
			}
			// If the underlay was clicked
			else if (delta > -5 && delta < 5 && (<HTMLElement> event.target).classList.contains(css.underlay)) {
				this.properties.onRequestClose && this.properties.onRequestClose();
			}
			// If panel was not swiped far enough to close
			else if (delta > 0) {
				content.classList.add(css.slideIn);
			}
		},

		render(this: SlidePanel): DNode {
			const {
				open = false,
				align = 'left',
				underlay = false,
				onOpen
			} = this.properties;

			const classes: {[key: string]: any} = {};
			const styles: {[key: string]: any} = {};

			classes[css.content] = true;
			// If panel is opening
			classes[css.slideIn] = open && !wasOpen ? true : false;
			// If panel is closing
			classes[css.slideOut] = !open && wasOpen ? true : false;
			// If panel is closing because of swipe
			styles[align] = !open && wasOpen && lastX !== 0 ? lastX + 'px' : '';

			const content = v('div', {
				key: 'content',
				classes: classes,
				styles: styles,
				afterCreate: afterCreate
			}, this.children);

			open && onOpen && onOpen();
			wasOpen = open;

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
			] : [
				content
			]);
		}
	}
});

export default createSlidePanel;
