import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/button.css';

export type ButtonType = 'submit' | 'reset' | 'button' | 'menu';

/**
 * @type ButtonProperties
 *
 * Properties that can be set on a Button component
 *
 * @property content			Text content of button
 * @property describedBy	ID of element with descriptive text
 * @property disabled			Whether the button is disabled or clickable
 * @property hasPopup			Whether the button triggers a popup
 * @property icon					Creates an icon button with the specified icon glyph
 * @property name					The button's name attribute
 * @property pressed			Indicates status of a toggle button
 * @property type					Button type can be "submit", "reset", "button", or "menu"
 * @property value				defines a value for the button submitted with form data
 * @property onBlur				Called when the button loses focus
 * @property onClick			Called when the button is clicked
 * @property onFocus			Called when the button is focused
 * @property onKeyDown		Called on the button's keydown event
 * @property onKeyPress		Called on the button's keypress event
 * @property onKeyUp			Called on the button's keyup event
 * @property onMouseDown	Called on the button's mousedown event
 * @property onMouseUp		Called on the button's mouseup event
 * @property onTouchStart	Called on the button's touchstart event
 * @property onTouchEnd		Called on the button's touchend event
 * @property onTouchCancel	Called on the button's touchcancel event
 */
export interface ButtonProperties extends ThemeableProperties {
	content?: string;
	describedBy?: string;
	disabled?: boolean;
	hasPopup?: boolean;
	icon?: string;
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
	onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	onKeyDown (event: KeyboardEvent) { this.properties.onKeyDown && this.properties.onKeyDown(event); }
	onKeyPress (event: KeyboardEvent) { this.properties.onKeyPress && this.properties.onKeyPress(event); }
	onKeyUp (event: KeyboardEvent) { this.properties.onKeyUp && this.properties.onKeyUp(event); }
	onMouseDown (event: MouseEvent) { this.properties.onMouseDown && this.properties.onMouseDown(event); }
	onMouseUp (event: MouseEvent) { this.properties.onMouseUp && this.properties.onMouseUp(event); }
	onTouchStart (event: TouchEvent) { this.properties.onTouchStart && this.properties.onTouchStart(event); }
	onTouchEnd (event: TouchEvent) { this.properties.onTouchEnd && this.properties.onTouchEnd(event); }
	onTouchCancel (event: TouchEvent) { this.properties.onTouchCancel && this.properties.onTouchCancel(event); }

	render() {
		const {
			content = '',
			describedBy,
			disabled,
			hasPopup,
			icon,
			name,
			pressed,
			type,
			value
		} = this.properties;

		const stateClasses = [
			disabled ? css.disabled : null,
			hasPopup ? css.popup : null,
			pressed ? css.pressed : null
		];

		return v('button', {
			innerHTML: content,
			classes: this.classes(css.button, ...stateClasses),
			'aria-describedby': describedBy,
			disabled,
			'aria-haspopup': typeof hasPopup === 'boolean' ? hasPopup.toString() : null,
			'data-dojo-icon': icon,
			name,
			'aria-pressed': typeof pressed === 'boolean' ? pressed.toString() : null,
			type,
			value,
			onblur: this.onBlur,
			onclick: this.onClick,
			onfocus: this.onFocus,
			onkeydown: this.onKeyDown,
			onkeypress: this.onKeyPress,
			onkeyup: this.onKeyUp,
			onmousedown: this.onMouseDown,
			onmouseup: this.onMouseUp,
			ontouchstart: this.onTouchStart,
			ontouchend: this.onTouchEnd,
			ontouchcancel: this.onTouchCancel
		});
	}
}
