import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/dialog';
import * as animations from '../../styles/animations';
import themeable, { Themeable } from '@dojo/widget-core/mixins/themeable';

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

export type Dialog = Widget<DialogProperties> & Themeable & {
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
			let key = 0;

			const { fadeIn, fadeOut } = animations;

			const {
				closeable = true,
				enterAnimation = fadeIn,
				exitAnimation = fadeOut,
				title = '',
				open = false,
				onOpen = null,
				underlay
			} = this.properties;

			const {
				main,
				underlay: underlayClass,
				close,
				title: titleClass,
				content
			} = css;

			open && onOpen && onOpen();

			return v('div', {
				'data-underlay': underlay ? 'true' : 'false',
				'data-open': open ? 'true' : 'false'
			}, open ? [
				v('div', {
					key: key++,
					classes: this.classes(underlayClass).get(),
					enterAnimation: fadeIn,
					exitAnimation: fadeOut,
					onclick: this.onUnderlayClick
				}),
				v('div', {
					key: key++,
					classes: this.classes(main).get(),
					enterAnimation: enterAnimation,
					exitAnimation: exitAnimation
				}, [
					v('div', { classes: this.classes(titleClass).get() }, [
						title,
						closeable ? v('div', {
							classes: this.classes(close).get(),
							innerHTML: '✕',
							onclick: this.onCloseClick
						}) : null
					]),
					v('div', { classes: this.classes(content).get() }, this.children)
				])
			] : []);
		}
	}
});

export default createDialog;
