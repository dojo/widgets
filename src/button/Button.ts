import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/button.m.css';

export type ButtonType = 'submit' | 'reset' | 'button' | 'menu';

/**
 * @type ButtonProperties
 *
 * Properties that can be set on a Button component
 *
 * @property content        Text content of button
 * @property describedBy    ID of element with descriptive text
 * @property disabled       Whether the button is disabled or clickable
 * @property popup       		Controls aria-haspopup, aria-expanded, and aria-controls for popup buttons
 * @property name           The button's name attribute
 * @property pressed        Indicates status of a toggle button
 * @property type           Button type can be "submit", "reset", "button", or "menu"
 * @property value          Defines a value for the button submitted with form data
 * @property onBlur         Called when the button loses focus
 * @property onClick        Called when the button is clicked
 * @property onFocus        Called when the button is focused
 * @property onKeyDown      Called on the button's keydown event
 * @property onKeyPress     Called on the button's keypress event
 * @property onKeyUp        Called on the button's keyup event
 * @property onMouseDown    Called on the button's mousedown event
 * @property onMouseUp      Called on the button's mouseup event
 * @property onTouchCancel  Called on the button's touchcancel event
 * @property onTouchEnd     Called on the button's touchend event
 * @property onTouchStart   Called on the button's touchstart event
 */
export interface ButtonProperties extends ThemeableProperties {
	content?: string;
	describedBy?: string;
	disabled?: boolean;
	id?: string;
	popup?: { expanded?: boolean; id?: string; } | boolean;
	name?: string;
	pressed?: boolean;
	type?: ButtonType;
	value?: string;
	onBlur?(event: FocusEvent): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onKeyDown?(event: KeyboardEvent): void;
	onKeyPress?(event: KeyboardEvent): void;
	onKeyUp?(event: KeyboardEvent): void;
	onMouseDown?(event: MouseEvent): void;
	onMouseUp?(event: MouseEvent): void;
	onTouchStart?(event: TouchEvent): void;
	onTouchEnd?(event: TouchEvent): void;
	onTouchCancel?(event: TouchEvent): void;
}

export const ButtonBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Button extends ButtonBase<ButtonProperties> {
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

	render(): DNode {
		let {
			content = '',
			describedBy,
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
			innerHTML: content,
			classes: this.classes(
				css.root,
				disabled ? css.disabled : null,
				popup ? css.popup : null,
				pressed ? css.pressed : null
			),
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
			'aria-haspopup': popup ? 'true' : null,
			'aria-controls': popup ? popup.id : null,
			'aria-expanded': popup ? popup.expanded + '' : null,
			'aria-pressed': typeof pressed === 'boolean' ? pressed.toString() : null,
			'aria-describedby': describedBy
		});
	}
}
