import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { v } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/button.m.css';
import { formatAriaProperties } from '../common/util';

import './button.css';

export interface ButtonProperties extends ThemedProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Whether the button is disabled or clickable */
	disabled?: boolean;
	/** The name of the button */
	name?: string;
	/** Handler for events triggered by button losing focus */
	onBlur?(): void;
	/** Handler for events triggered by a button click */
	onClick?(): void;
	/** Handler for events triggered by "on down" */
	onDown?(): void;
	/** Handler for events triggered by "on focus" */
	onFocus?(): void;
	/** Handler for events triggered by "on out" */
	onOut?(): void;
	/** Handler for events triggered by "on over" */
	onOver?(): void;
	/** Handler for events triggered by "on up" */
	onUp?(): void;
	/** Indicates status of a toggle button */
	pressed?: boolean;
	/** Button type can be "submit", "reset", "button", or "menu" */
	type?: 'submit' | 'reset' | 'button' | 'menu';
	/**  Defines a value for the button submitted with form data */
	value?: string;
	/** `id` set on the root button DOM node */
	widgetId?: string;
}

@theme(css)
export class Button extends ThemedMixin(FocusMixin(WidgetBase))<ButtonProperties> {
	private _onClick(event: MouseEvent) {
		event.stopPropagation();
		this.properties.onClick && this.properties.onClick();
	}

	protected getModifierClasses(): (string | null)[] {
		const { disabled, pressed } = this.properties;

		return [disabled ? css.disabled : null, pressed ? css.pressed : null];
	}

	render(): DNode {
		let {
			aria = {},
			disabled,
			widgetId,
			name,
			pressed,
			type,
			value,
			onOut,
			onOver,
			onDown,
			onUp,
			onBlur,
			onFocus
		} = this.properties;

		return v(
			'button',
			{
				classes: this.theme([css.root, ...this.getModifierClasses()]),
				disabled,
				id: widgetId,
				focus: this.shouldFocus,
				name,
				type,
				value,
				onblur: () => {
					onBlur && onBlur();
				},
				onclick: this._onClick,
				onfocus: () => {
					onFocus && onFocus();
				},
				onpointerenter: () => {
					onOver && onOver();
				},
				onpointerleave: () => {
					onOut && onOut();
				},
				onpointerdown: () => {
					onDown && onDown();
				},
				onpointerup: () => {
					onUp && onUp();
				},
				...formatAriaProperties(aria),
				'aria-pressed': typeof pressed === 'boolean' ? pressed.toString() : null
			},
			this.children
		);
	}
}

export default Button;
