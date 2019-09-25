import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { v, w } from '@dojo/framework/core/vdom';
import * as css from '../theme/button.m.css';
import { formatAriaProperties } from '../common/util';
import Icon from '../icon/index';

export type ButtonType = 'submit' | 'reset' | 'button' | 'menu';

/**
 * @type ButtonProperties
 *
 * Properties that can be set on a Button component
 *
 * @property aria
 * @property disabled       Whether the button is disabled or clickable
 * @property name           The button's name attribute
 * @property onBlur
 * @property onClick
 * @property onDown
 * @property onFocus
 * @property onOut
 * @property onOver
 * @property onUp
 * @property popup       		Controls aria-haspopup, aria-expanded, and aria-controls for popup buttons
 * @property pressed        Indicates status of a toggle button
 * @property type           Button type can be "submit", "reset", "button", or "menu"
 * @property value          Defines a value for the button submitted with form data
 * @property widgetId       DOM id set on the root button node
 */
export interface ButtonProperties extends ThemedProperties, FocusProperties {
	aria?: { [key: string]: string | null };
	disabled?: boolean;
	name?: string;
	onBlur?(): void;
	onClick?(): void;
	onDown?(): void;
	onFocus?(): void;
	onOut?(): void;
	onOver?(): void;
	onUp?(): void;
	pressed?: boolean;
	type?: ButtonType;
	value?: string;
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
