import { DNode, Widget, WidgetProperties, WidgetFactory } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';

import * as css from './styles/dialog.css';
import * as animations from '../../styles/animations.css';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';

/**
 * @type DialogProperties
 *
 * Properties that can be set on a Dialog component
 *
 * @property	{boolean?}		closeable		Determines whether the dialog can be closed
 * @property	{string?}		enterAnimation	CSS class to apply to the dialog when opened
 * @property	{string?}		exitAnimation	CSS class to apply to the dialog when closed
 * @property	{boolean?}		modal			Determines whether the dialog can be closed by clicking outside its content
 * @property	{boolean?}		open			Determines whether the dialog is open or closed
 * @property	{string?}		role			Role of this dialog for accessibility, either 'alert' or 'dialog'
 * @property	{string?}		title			Title to show in the dialog title bar
 * @property	{boolean?}		underlay		Determines whether a semi-transparent background shows behind the dialog
 * @property	{Function?}		onOpen			Called when the dialog opens
 * @property	{Function?}		onRequestClose	Called when the dialog is closed
 */
export interface DialogProperties extends WidgetProperties {
	closeable?: boolean;
	enterAnimation?: string;
	exitAnimation?: string;
	modal?: boolean;
	open?: boolean;
	role?: string;
	title?: string;
	underlay?: boolean;
	onOpen?(): void;
	onRequestClose?(): void;
};

/**
 * @type Dialog
 *
 * A Dialog component
 *
 * @property	{Function?}		onCloseClick		Event handler for when the close button is clicked
 * @property	{Function?}		onUnderlayClick		Event handler for when a click occurs outside the dialog
 */
export type Dialog = Widget<DialogProperties> & ThemeableMixin & {
	onCloseClick?(): void;
	onUnderlayClick?(): void;
};

/**
 * @type DialogFactory
 *
 * Widget factory that creates a Dialog component
 */
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
				role = 'dialog',
				underlay = false,
				onOpen
			} = this.properties;

			const titleId = uuid();

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
					exitAnimation: exitAnimation,
					'aria-labelledby': titleId,
					role: role === 'dialog' ? 'dialog' : 'alertdialog'
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
});

export default createDialog;
