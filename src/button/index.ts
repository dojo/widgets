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
 * @property disabled       Whether the button is disabled or clickable
 * @property widgetId       DOM id set on the root button node
 * @property popup       		Controls aria-haspopup, aria-expanded, and aria-controls for popup buttons
 * @property name           The button's name attribute
 * @property pressed        Indicates status of a toggle button
 * @property type           Button type can be "submit", "reset", "button", or "menu"
 * @property value          Defines a value for the button submitted with form data
 */
export interface ButtonProperties extends ThemedProperties, FocusProperties {
	aria?: { [key: string]: string | null };
	disabled?: boolean;
	widgetId?: string;
	popup?: { expanded?: boolean; id?: string } | boolean;
	name?: string;
	pressed?: boolean;
	type?: ButtonType;
	value?: string;
	onClick?(): void;
	onBlur?(): void;
	onFocus?(): void;
}

@theme(css)
export class Button extends ThemedMixin(FocusMixin(WidgetBase))<ButtonProperties> {
	private _onBlur() {
		this.properties.onBlur && this.properties.onBlur();
	}
	private _onClick(event: MouseEvent) {
		event.stopPropagation();
		this.properties.onClick && this.properties.onClick();
	}
	private _onFocus() {
		this.properties.onFocus && this.properties.onFocus();
	}

	protected getModifierClasses(): (string | null)[] {
		const { disabled, popup = false, pressed } = this.properties;

		return [
			disabled ? css.disabled : null,
			popup ? css.popup : null,
			pressed ? css.pressed : null
		];
	}

	render(): DNode {
		let {
			aria = {},
			disabled,
			widgetId,
			popup = false,
			name,
			pressed,
			type,
			value,
			theme,
			classes
		} = this.properties;

		if (popup === true) {
			popup = { expanded: false, id: '' };
		}

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
				onblur: this._onBlur,
				onclick: this._onClick,
				onfocus: this._onFocus,
				...formatAriaProperties(aria),
				'aria-haspopup': popup ? 'true' : null,
				'aria-controls': popup ? popup.id : null,
				'aria-expanded': popup ? popup.expanded + '' : null,
				'aria-pressed': typeof pressed === 'boolean' ? pressed.toString() : null
			},
			[
				...this.children,
				popup
					? v('span', { classes: this.theme(css.addon) }, [
							w(Icon, { type: 'downIcon', theme, classes })
					  ])
					: null
			]
		);
	}
}

export default Button;
