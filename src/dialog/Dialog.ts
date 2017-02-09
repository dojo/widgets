import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';

import * as css from './styles/dialog.css';
import * as animations from '../styles/animations.css';

/**
 * Enum for dialog / alertdialog role
 */
export const enum Role {
	dialog,
	alertdialog
};

/**
 * @type DialogProperties
 *
 * Properties that can be set on a Dialog component
 *
 * @property closeable			Determines whether the dialog can be closed
 * @property enterAnimation		CSS class to apply to the dialog when opened
 * @property exitAnimation		CSS class to apply to the dialog when closed
 * @property modal				Determines whether the dialog can be closed by clicking outside its content
 * @property open				Determines whether the dialog is open or closed
 * @property role				Role of this dialog for accessibility, either 'alert' or 'dialog'
 * @property title				Title to show in the dialog title bar
 * @property underlay			Determines whether a semi-transparent background shows behind the dialog
 * @property onOpen				Called when the dialog opens
 * @property onRequestClose		Called when the dialog is closed
 */
export interface DialogProperties extends ThemeableProperties {
	closeable?: boolean;
	enterAnimation?: string;
	exitAnimation?: string;
	modal?: boolean;
	open?: boolean;
	role?: Role;
	title?: string;
	underlay?: boolean;
	onOpen?(): void;
	onRequestClose?(): void;
};

@theme(css)
export default class Dialog extends ThemeableMixin(WidgetBase)<DialogProperties> {
	onCloseClick() {
		const { closeable = true } = this.properties;
		closeable && this.properties.onRequestClose && this.properties.onRequestClose();
	}

	onUnderlayClick() {
		!this.properties.modal && this.onCloseClick();
	}

	render() {
		const {
			closeable = true,
			enterAnimation = animations.fadeIn,
			exitAnimation = animations.fadeOut,
			title = '',
			open = false,
			role = Role.dialog,
			underlay = false,
			onOpen
		} = this.properties;

		const titleId = uuid();

		open && onOpen && onOpen();

		return v('div', {}, open ? [
			v('div', {
				key: 'underlay',
				classes: this.classes(css.underlay).fixed(underlay ? css.underlayVisible : null).get(),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut,
				onclick: this.onUnderlayClick
			}),
			v('div', {
				key: 'main',
				classes: this.classes(css.main).get(),
				enterAnimation: enterAnimation,
				exitAnimation: exitAnimation,
				'aria-labelledby': titleId,
				role: role
			}, [
				v('div', {
					key: 'title',
					id: titleId,
					classes: this.classes(css.title).get()
				}, [
					title,
					closeable ? v('button', {
						classes: this.classes(css.close).get(),
						innerHTML: 'close dialog',
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
