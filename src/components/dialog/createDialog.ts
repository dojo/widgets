import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/dialog.css';
import * as animations from '../../styles/animations.css';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';

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

export type Dialog = Widget<DialogProperties> & ThemeableMixin & {
	onCloseClick?(): void;
	onUnderlayClick?(): void;
};

export interface DialogFactory extends WidgetFactory<Dialog, DialogProperties> { };

const createDialog: DialogFactory = createWidgetBase.mixin(themeable).mixin({
	mixin: {
		baseClasses: css,

		onCloseClick(this: Dialog) {
			const { closeable = true } = this.properties;
			closeable && this.properties.onRequestClose && this.properties.onRequestClose();
		},

		onUnderlayClick(this: Dialog) {
			!this.properties.modal && this.onCloseClick && this.onCloseClick();
		},

		render(this: Dialog): DNode {
			const {
				closeable = true,
				enterAnimation = animations.fadeIn,
				exitAnimation = animations.fadeOut,
				title = '',
				open = false,
				underlay = false,
				onOpen
			} = this.properties;

			open && onOpen && onOpen();

			return v('div', {
				'data-underlay': underlay ? 'true' : 'false',
				'data-open': open ? 'true' : 'false'
			}, open ? [
				v('div', {
					key: 'underlay',
					classes: this.classes(css.underlay).get(),
					enterAnimation: animations.fadeIn,
					exitAnimation: animations.fadeOut,
					onclick: this.onUnderlayClick
				}),
				v('div', {
					key: 'main',
					classes: this.classes(css.main).get(),
					enterAnimation: enterAnimation,
					exitAnimation: exitAnimation
				}, [
					v('div', {
						key: 'title',
						classes: this.classes(css.title).get()
					}, [
						title,
						closeable ? v('div', {
							classes: this.classes(css.close).get(),
							innerHTML: '✕',
							onclick: this.onCloseClick
						}) : null
					]),
					v('div', {
						key: 'content',
						classes: this.classes(css.content).get()
					}, this.children)
				])
			] : []);
		}
	}
});

export default createDialog;
