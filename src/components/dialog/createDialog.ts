import { VNodeProperties } from '@dojo/interfaces/vdom';
import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';

import * as baseTheme from './styles/dialog';
import themeableMixin, { Themeable } from '@dojo/widget-core/mixins/themeable';

export interface DialogProperties extends WidgetProperties {
	closeable?: boolean;
	enterAnimation?: string;
	exitAnimation?: string;
	modal?: boolean;
	open?: boolean;
	title?: string;
	underlay?: boolean;
	onOpen?(): void;
	onRequestClose?(): void;
};

export type Dialog = Widget<DialogProperties> & Themeable<typeof baseTheme> & {
	onCloseClick?(): void;
	onUnderlayClick?(): void;
};

export interface DialogFactory extends WidgetFactory<Dialog, DialogProperties> { };

const createDialog: DialogFactory = createWidgetBase.mixin(themeableMixin).mixin({
	mixin: {
		baseTheme,

		onCloseClick: function (this: Dialog) {
			const closeable = this.properties.closeable || typeof this.properties.closeable === 'undefined';
			closeable && this.properties.onRequestClose && this.properties.onRequestClose();
		},

		onUnderlayClick: function (this: Dialog) {
			!this.properties.modal && this.onCloseClick && this.onCloseClick();
		},

		getChildrenNodes: function (this: Dialog): DNode[] {
			const {
				closeable = true,
				enterAnimation = 'show',
				exitAnimation = 'hide',
				title = '',
				open = false
			} = this.properties;

			const children: DNode[] = [
				v('div', {
					classes: this.theme.underlay,
					enterAnimation: 'show',
					exitAnimation: 'hide',
					onclick: this.onUnderlayClick
				}),
				v('div', {
					classes: this.theme.main,
					enterAnimation: enterAnimation,
					exitAnimation: exitAnimation
				}, [
					v('div', {
						classes: this.theme.title
					}, [
						title,
						closeable ? v('div', {
							classes: this.theme.close,
							innerHTML: '✕',
							onclick: this.onCloseClick
						}) : null
					]),
					v('div', { classes: this.theme.content }, this.children)
				])
			];

			return open ? children : [];
		},

		nodeAttributes: [
			function(this: Dialog): VNodeProperties {
				this.properties.open && this.properties.onOpen && this.properties.onOpen();
				return {
					'data-underlay': this.properties.underlay ? 'true' : 'false',
					'data-open': this.properties.open ? 'true' : 'false'
				};
			}
		]
	}
});

export default createDialog;
