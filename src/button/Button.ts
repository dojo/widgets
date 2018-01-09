import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import * as css from '../theme/button/button.m.css';
import * as iconCss from '../theme/common/icons.m.css';
import { CustomAriaProperties, InputEventProperties, PointerEventProperties, KeyEventProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';

export type ButtonType = 'submit' | 'reset' | 'button' | 'menu';

/**
 * @type ButtonProperties
 *
 * Properties that can be set on a Button component
 *
 * @property disabled       Whether the button is disabled or clickable
 * @property popup       		Controls aria-haspopup, aria-expanded, and aria-controls for popup buttons
 * @property name           The button's name attribute
 * @property pressed        Indicates status of a toggle button
 * @property type           Button type can be "submit", "reset", "button", or "menu"
 * @property value          Defines a value for the button submitted with form data
 */
export interface ButtonProperties extends ThemedProperties, InputEventProperties, PointerEventProperties, KeyEventProperties, CustomAriaProperties {
	disabled?: boolean;
	id?: string;
	popup?: { expanded?: boolean; id?: string; } | boolean;
	name?: string;
	pressed?: boolean;
	type?: ButtonType;
	value?: string;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@theme(iconCss)
export default class Button<P extends ButtonProperties = ButtonProperties> extends ThemedBase<P> {
	private _onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	private _onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	private _onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	private _onKeyDown (event: KeyboardEvent) { this.properties.onKeyDown && this.properties.onKeyDown(event); }
	private _onKeyPress (event: KeyboardEvent) { this.properties.onKeyPress && this.properties.onKeyPress(event); }
	private _onKeyUp (event: KeyboardEvent) { this.properties.onKeyUp && this.properties.onKeyUp(event); }
	private _onMouseDown (event: MouseEvent) { this.properties.onMouseDown && this.properties.onMouseDown(event); }
	private _onMouseUp (event: MouseEvent) { this.properties.onMouseUp && this.properties.onMouseUp(event); }
	private _onTouchStart (event: TouchEvent) { this.properties.onTouchStart && this.properties.onTouchStart(event); }
	private _onTouchEnd (event: TouchEvent) { this.properties.onTouchEnd && this.properties.onTouchEnd(event); }
	private _onTouchCancel (event: TouchEvent) { this.properties.onTouchCancel && this.properties.onTouchCancel(event); }

	protected getContent(): DNode[] {
		return this.children;
	}

	protected getModifierClasses(): (string | null)[] {
		const {
			disabled,
			popup = false,
			pressed
		} = this.properties;

		return [
			disabled ? css.disabled : null,
			popup ? css.popup : null,
			pressed ? css.pressed : null
		];
	}

	protected renderPopupIcon(): DNode {
		return v('i', { classes: this.theme([ css.addon, iconCss.icon, iconCss.downIcon ]),
			role: 'presentation', 'aria-hidden': 'true'
		});
	}

	render(): DNode {
		let {
			aria = {},
			disabled,
			id,
			popup = false,
			name,
			pressed,
			type,
			value
		} = this.properties;

		if (popup === true) {
			popup = { expanded: false, id: '' };
		}

		return v('button', {
			classes: this.theme([ css.root, ...this.getModifierClasses() ]),
			disabled,
			id,
			name,
			type,
			value,
			onblur: this._onBlur,
			onclick: this._onClick,
			onfocus: this._onFocus,
			onkeydown: this._onKeyDown,
			onkeypress: this._onKeyPress,
			onkeyup: this._onKeyUp,
			onmousedown: this._onMouseDown,
			onmouseup: this._onMouseUp,
			ontouchstart: this._onTouchStart,
			ontouchend: this._onTouchEnd,
			ontouchcancel: this._onTouchCancel,
			...formatAriaProperties(aria),
			'aria-haspopup': popup ? 'true' : null,
			'aria-controls': popup ? popup.id : null,
			'aria-expanded': popup ? popup.expanded + '' : null,
			'aria-pressed': typeof pressed === 'boolean' ? pressed.toString() : null
		}, [
			...this.getContent(),
			popup ? this.renderPopupIcon() : null
		]);
	}
}
