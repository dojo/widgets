import { VNodeProperties } from '@dojo/interfaces/vdom';
import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';

import * as baseTheme from './styles/slidePanel';
import * as animations from '../../styles/animations';
import themeableMixin, { Themeable } from '@dojo/widget-core/mixins/themeable';

export interface SlidePanelProperties extends WidgetProperties {
	align?: string;
	open?: boolean;
	underlay?: boolean;
	onOpen?(): void;
	onRequestClose?(): void;
};

export type SlidePanel = Widget<SlidePanelProperties> & Themeable<typeof baseTheme> & {
	onSwipeStart?(event: TouchEvent & MouseEvent): void;
	onSwipeMove?(event: TouchEvent & MouseEvent): void;
	onSwipeEnd?(event: TouchEvent & MouseEvent): void;
};

export interface SlidePanelFactory extends WidgetFactory<SlidePanel, SlidePanelProperties> { };

let initialX = 0;
let lastX = 0;
let contentWidth = 0;
let wasOpen = false;
let swiping = false;

function onTransitionEnd(this: SlidePanel, event: TransitionEvent) {
	const content = (<HTMLElement> event.target);
	content.classList.remove(this.baseTheme.slideIn, this.baseTheme.slideOut);
	content.style[this.properties.align === 'right' ? 'right' : 'left'] = '';
}

function afterUpdate(this: SlidePanel, element: HTMLElement) {
	element.addEventListener('transitionend', onTransitionEnd.bind(this));
}

const createSlidePanel: SlidePanelFactory = createWidgetBase.mixin(themeableMixin).mixin({
	mixin: {
		baseTheme,

		onSwipeStart: function (this: SlidePanel, event: TouchEvent & MouseEvent) {
			swiping = true;
			initialX = event.type === 'touchstart' ? event.changedTouches[0].screenX : event.pageX;
			lastX = 0;
			const content = <HTMLElement> document.querySelector(`.${ this.baseTheme.content }`);
			content.style.transition = '';
			contentWidth = content.clientWidth;
		},

		onSwipeMove: function (this: SlidePanel, event: TouchEvent & MouseEvent) {
			if (!swiping) {
				return;
			}
			let currentX = event.type === 'touchmove' ? event.changedTouches[0].screenX : event.pageX;
			let delta = this.properties.align === 'right' ? currentX - initialX : initialX - currentX;
			const content = <HTMLElement> document.querySelector(`.${ this.baseTheme.content }`);
			if (delta > 0) {
				content.style[this.properties.align === 'right' ? 'right' : 'left'] = -delta + 'px';
			}
		},

		onSwipeEnd: function (this: SlidePanel, event: TouchEvent & MouseEvent) {
			swiping = false;
			let currentX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.pageX;
			let delta = this.properties.align === 'right' ? currentX - initialX : initialX - currentX;
			const content = <HTMLElement> document.querySelector(`.${ this.baseTheme.content }`);
			console.log(delta, contentWidth / 2);
			if (delta > contentWidth / 2) {
				lastX = Number(content.style[this.properties.align === 'right' ? 'right' : 'left']!.replace(/px$/, ''));
				lastX = lastX === 0 ? 1 : lastX;
				this.properties.onRequestClose && this.properties.onRequestClose();
			}
			else {
				delta > 0 && content.classList.add(this.baseTheme.slideIn);
			}
		},

		getChildrenNodes: function (this: SlidePanel): DNode[] {
			const {
				open = false,
				align = 'left'
			} = this.properties;

			let key = 0;

			const underlay = v('div', {
				key: key++,
				classes: this.theme.underlay,
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut
			});

			const classes: {[key: string]: any} = {};
			const styles: {[key: string]: any} = {};

			classes[this.baseTheme.content] = true;
			classes[this.baseTheme.slideIn] = open && !wasOpen ? true : false;
			classes[this.baseTheme.slideOut] = !open && wasOpen ? true : false;
			styles[align] = !open && wasOpen && lastX !== 0 ? lastX + 'px' : '';

			const content = v('div', {
				key: key++,
				classes: classes,
				styles: styles,
				afterUpdate: afterUpdate
			}, this.children);

			wasOpen = open;

			return open ? [underlay, content] : [content];
		},

		nodeAttributes: [
			function(this: SlidePanel): VNodeProperties {
				this.properties.open && this.properties.onOpen && this.properties.onOpen();
				return {
					'data-open': this.properties.open ? 'true' : 'false',
					'data-underlay': this.properties.underlay ? 'true' : 'false',
					'data-align': this.properties.align || 'left',
					ontouchstart: this.onSwipeStart,
					ontouchmove: this.onSwipeMove,
					ontouchend: this.onSwipeEnd,
					onmousedown: this.onSwipeStart,
					onmousemove: this.onSwipeMove,
					onmouseup: this.onSwipeEnd
				};
			}
		]
	}
});

export default createSlidePanel;
