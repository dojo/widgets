import { VNodeProperties } from '@dojo/interfaces/vdom';
import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';

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

export type Dialog = Widget<DialogProperties> & {
	onCloseClick?(): void;
	onUnderlayClick?(): void;
};

export interface DialogFactory extends WidgetFactory<Dialog, DialogProperties> { };

const createDialogWidget: DialogFactory = createWidgetBase.mixin({
	mixin: {
		onCloseClick: function (this: Dialog) {
			const closeable = this.properties.closeable || typeof this.properties.closeable === 'undefined';
			closeable && this.properties.onRequestClose && this.properties.onRequestClose.call(this);
		},

		onUnderlayClick: function (this: Dialog) {
			!this.properties.modal && this.onCloseClick && this.onCloseClick();
		},

		getChildrenNodes: function (this: Dialog): DNode[] {
			const {
				closeable = true,
				enterAnimation = 'show',
				exitAnimation = 'hide'
			} = this.properties;

			const children: DNode[] = [
				v('div.underlay', {
					enterAnimation: 'show',
					exitAnimation: 'hide',
					onclick: this.onUnderlayClick
				}),
				v('div.main', {
					enterAnimation: enterAnimation,
					exitAnimation: exitAnimation
				}, [
					v('div.title', [
						this.properties.title ? this.properties.title : null,
						closeable ? v('div.close', {
							innerHTML: '✕',
							onclick: this.onCloseClick
						}) : null
					]),
					v('div.content', this.children)
				])
			];

			return this.properties.open ? children : [];
		},

		nodeAttributes: [
			function(this: Dialog): VNodeProperties {
				this.properties.open && this.properties.onOpen && this.properties.onOpen.call(this);
				return {
					'data-underlay': this.properties.underlay ? 'true' : 'false',
					'data-open': this.properties.open ? 'true' : 'false'
				};
			}
		],

		classes: [ 'dialog' ]
	}
});

export default createDialogWidget;
