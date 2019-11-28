import { DNode } from '@dojo/framework/core/interfaces';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { I18nMixin, I18nProperties } from '@dojo/framework/core/mixins/I18n';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import Focus from '../meta/Focus';
import { v, w } from '@dojo/framework/core/vdom';
import { uuid } from '@dojo/framework/core/util';
import { formatAriaProperties, Keys } from '../common/util';
import commonBundle from '../common/nls/common';

import Icon from '../icon/index';
import * as fixedCss from './styles/dialog.m.css';
import * as css from '../theme/default/dialog.m.css';
import { GlobalEvent } from '../global-event/index';

/**
 * The role of this dialog, used for accessibility
 */
export type RoleType = 'dialog' | 'alertdialog';

export interface DialogProperties extends ThemedProperties, I18nProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Determines whether the dialog can be closed */
	closeable?: boolean;
	/** Hidden text used by screen readers to display for the close button */
	closeText?: string;
	/** css class to be used when animating the dialog entering, or null to disable the animation */
	enterAnimation?: string | null;
	/** css class to be used when animating the dialog exiting, or null to disable the animation */
	exitAnimation?: string | null;
	/** Determines whether the dialog can be closed by clicking outside its content */
	modal?: boolean;
	/** Called when the dialog opens */
	onOpen?(): void;
	/** Called when the dialog is closed */
	onRequestClose?(): void;
	/** Determines whether the dialog is open or closed */
	open?: boolean;
	/** Role of this dialog for accessibility, either 'alert' or 'dialog' */
	role?: RoleType;
	/** Title to show in the dialog title bar */
	title?: string;
	/** Determines whether a semi-transparent background shows behind the dialog */
	underlay?: boolean;
	/** css class to be used when animating the dialog underlay entering, or null to disable the animation */
	underlayEnterAnimation?: string | null;
	/** css class to be used when animating the dialog underlay exiting, or null to disable the animation */
	underlayExitAnimation?: string | null;
}

@theme(css)
export class Dialog extends I18nMixin(ThemedMixin(WidgetBase))<DialogProperties> {
	private _titleId = uuid();
	private _wasOpen: boolean | undefined;
	private _callFocus = false;
	private _initialFocusSet = false;

	private _onCloseClick(event: MouseEvent) {
		event.stopPropagation();
		this._close();
	}

	private _checkFocus() {
		const { modal, open } = this.properties;

		// only handle focus for open dialog
		if (!open) {
			return;
		}

		const dialogFocus = this.meta(Focus).get('main');
		if (dialogFocus.containsFocus) {
			this._callFocus = false;
			this._initialFocusSet = true;
		}

		// handle if the dialog is open and loses focus
		if (this._initialFocusSet && !dialogFocus.containsFocus) {
			modal ? (this._callFocus = true) : this._close();
		}

		if (this._callFocus) {
			this.meta(Focus).set('main');
		}
	}

	private _close() {
		const { closeable = true, onRequestClose } = this.properties;

		closeable && onRequestClose && onRequestClose();
	}

	private _onUnderlayClick(event: MouseEvent) {
		event.stopPropagation();
		!this.properties.modal && this._close();
	}

	private _onKeyUp = (event: KeyboardEvent): void => {
		event.stopPropagation();
		if (event.which === Keys.Escape) {
			this._close();
		}
	};

	private _onOpen() {
		const { onOpen } = this.properties;
		this._callFocus = true;
		this._initialFocusSet = false;
		onOpen && onOpen();
	}

	protected getContent(): DNode {
		return v(
			'div',
			{
				classes: this.theme(css.content),
				key: 'content'
			},
			this.children
		);
	}

	protected renderTitle(): DNode {
		const { title = '' } = this.properties;
		return v('div', { id: this._titleId }, [title]);
	}

	protected renderUnderlay(): DNode {
		const {
			underlay,
			underlayEnterAnimation = this.theme(css.underlayEnter),
			underlayExitAnimation = this.theme(css.underlayExit)
		} = this.properties;
		return v('div', {
			classes: [this.theme(underlay ? css.underlayVisible : null), fixedCss.underlay],
			enterAnimation: underlayEnterAnimation,
			exitAnimation: underlayExitAnimation,
			key: 'underlay',
			onclick: this._onUnderlayClick
		});
	}

	protected render(): DNode {
		let {
			aria = {},
			closeable = true,
			closeText,
			enterAnimation = this.theme(css.enter),
			exitAnimation = this.theme(css.exit),
			open = false,
			role = 'dialog',
			title = '',
			theme,
			classes
		} = this.properties;

		open && !this._wasOpen && this._onOpen();
		this._wasOpen = open;

		this._checkFocus();

		if (!closeText) {
			const { messages } = this.localizeBundle(commonBundle);
			closeText = `${messages.close} ${title}`;
		}

		return v(
			'div',
			{
				classes: this.theme([css.root, open ? css.open : null])
			},
			open
				? [
						w(GlobalEvent, { key: 'global', document: { keyup: this._onKeyUp } }),
						this.renderUnderlay(),
						v(
							'div',
							{
								...formatAriaProperties(aria),
								'aria-labelledby': this._titleId,
								classes: this.theme(css.main),
								enterAnimation,
								exitAnimation,
								key: 'main',
								role,
								tabIndex: -1
							},
							[
								v(
									'div',
									{
										classes: this.theme(css.title),
										key: 'title'
									},
									[
										this.renderTitle(),
										closeable
											? v(
													'button',
													{
														classes: this.theme(css.close),
														type: 'button',
														onclick: this._onCloseClick
													},
													[
														closeText,
														v(
															'span',
															{ classes: this.theme(css.closeIcon) },
															[
																w(Icon, {
																	type: 'closeIcon',
																	theme,
																	classes
																})
															]
														)
													]
											  )
											: null
									]
								),
								this.getContent()
							]
						)
				  ]
				: []
		);
	}
}

export default Dialog;
