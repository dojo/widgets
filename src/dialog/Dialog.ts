import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';

import * as css from './styles/dialog.m.css';
import * as animations from '../common/styles/animations.m.css';

/**
 * The role of this dialog, used for accessibility
 */
export type RoleType = 'dialog' | 'alertdialog';

/**
 * @type DialogProperties
 *
 * Properties that can be set on a Dialog component
 *
 * @property closeable          Determines whether the dialog can be closed
 * @property closeText          Hidden text used by screen readers to display for the close button
 * @property enterAnimation     CSS class to apply to the dialog when opened
 * @property exitAnimation      CSS class to apply to the dialog when closed
 * @property modal              Determines whether the dialog can be closed by clicking outside its content
 * @property onOpen             Called when the dialog opens
 * @property onRequestClose     Called when the dialog is closed
 * @property open               Determines whether the dialog is open or closed
 * @property role               Role of this dialog for accessibility, either 'alert' or 'dialog'
 * @property title              Title to show in the dialog title bar
 * @property underlay           Determines whether a semi-transparent background shows behind the dialog
 */
export interface DialogProperties extends ThemeableProperties {
	closeable?: boolean;
	closeText?: string;
	enterAnimation?: string;
	exitAnimation?: string;
	modal?: boolean;
	onOpen?(): void;
	onRequestClose?(): void;
	open?: boolean;
	role?: RoleType;
	title?: string;
	underlay?: boolean;
};

export const DialogBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Dialog extends DialogBase<DialogProperties> {
	private _titleId = uuid();
	private _wasOpen: boolean;

	private _onCloseClick() {
		const {
			closeable = true,
			onRequestClose
		} = this.properties;

		closeable && onRequestClose && onRequestClose();
	}

	private _onUnderlayClick() {
		!this.properties.modal && this._onCloseClick();
	}

	render(): DNode {
		const {
			closeable = true,
			closeText = 'close dialog',
			enterAnimation = animations.fadeIn,
			exitAnimation = animations.fadeOut,
			onOpen,
			open = false,
			role = 'dialog',
			title = '',
			underlay
		} = this.properties;

		open && !this._wasOpen && onOpen && onOpen();

		this._wasOpen = open;

		return v('div', { classes: this.classes(css.root) }, open ? [
			v('div', {
				classes: this.classes(underlay ? css.underlayVisible : null).fixed(css.underlay),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut,
				key: 'underlay',
				onclick: this._onUnderlayClick
			}),
			v('div', {
				'aria-labelledby': this._titleId,
				classes: this.classes(css.main),
				enterAnimation,
				exitAnimation,
				key: 'main',
				role
			}, [
				v('div', {
					classes: this.classes(css.title),
					id: this._titleId,
					key: 'title'
				}, [
					title,
					closeable ? v('button', {
						classes: this.classes(css.close),
						innerHTML: closeText,
						onclick: this._onCloseClick
					}) : null
				]),
				v('div', {
					classes: this.classes(css.content),
					key: 'content'
				}, this.children)
			])
		] : []);
	}
}
