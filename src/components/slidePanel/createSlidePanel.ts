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
	width?: number;
	onOpen?(): void;
	onRequestClose?(): void;
};

export type SlidePanel = Widget<SlidePanelProperties> & ThemeableMixin & {
	onSwipeStart?(event: MouseEvent & TouchEvent): void;
	onSwipeMove?(event: MouseEvent & TouchEvent): void;
	onSwipeEnd?(event: MouseEvent & TouchEvent): void;
};

export interface SlidePanelFactory extends WidgetFactory<SlidePanel, SlidePanelProperties> { };

let content: HTMLElement;
let initialX = 0;
let transform = 0;
let swiping = false;
let wasOpen = false;

function afterCreate(this: SlidePanel, element: HTMLElement) {
	element.addEventListener('transitionend', onTransitionEnd.bind(this));
	content = element;
}

function onTransitionEnd(this: SlidePanel, event: TransitionEvent) {
	const content = (<HTMLElement> event.target);
	content.classList.remove(css.slideIn, css.slideOut);
	content.style.transform = '';
}

const createSlidePanel: SlidePanelFactory = createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseClasses: css,

		onSwipeStart(this: SlidePanel, event: MouseEvent & TouchEvent) {
			event.stopPropagation();
			event.preventDefault();

			initialX = event.type === 'touchstart' ? event.changedTouches[0].screenX : event.pageX;
			transform = 0;
			swiping = true;
		},

		onSwipeMove(this: SlidePanel, event: MouseEvent & TouchEvent) {
			// Ignore mouse movement when not clicking
			if (!swiping) {
				return;
			}

			const {
				width = 256,
				align = 'left'
			} = this.properties;

			let currentX = event.type === 'touchmove' ? event.changedTouches[0].screenX : event.pageX;
			let delta = align === 'right' ? currentX - initialX : initialX - currentX;
			transform = 100 * delta / width;

			// Prevent panel from sliding past screen edge
			if (delta <= 0) {
				return;
			}

			if (content) {
				content.style.transform =  `translateX(${ align === 'left' ? '-' : '' }${ transform }%)`;
			}
		},

		onSwipeEnd(this: SlidePanel, event: MouseEvent & TouchEvent) {
			swiping = false;

			const {
				width = 256,
				align = 'left',
				onRequestClose
			} = this.properties;

			let currentX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.pageX;
			let delta = align === 'right' ? currentX - initialX : initialX - currentX;

			// If the panel was swiped far enough to close
			if (delta > width / 2) {
				transform = 100 * delta / width;
				onRequestClose && onRequestClose();
			}
			// If the underlay was clicked
			else if (delta > -5 && delta < 5 && (<HTMLElement> event.target).classList.contains(css.underlay)) {
				onRequestClose && onRequestClose();
			}
			// If panel was not swiped far enough to close
			else if (delta > 0) {
				content && content.classList.add(css.slideIn);
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
			if (!open && wasOpen && transform !== 0) {
				styles['transform'] = `translateX(${ align === 'left' ? '-' : '' }${ transform }%)`;
			}

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
			] : [ content ]);
		}
	}
});

export default createSlidePanel;
