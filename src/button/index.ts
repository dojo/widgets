import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import * as css from '../theme/button.m.css';
import { CustomAriaProperties, InputEventProperties, PointerEventProperties, KeyEventProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import { customElement } from '@dojo/widget-core/decorators/customElement';
import Icon from '../icon/index';
import { CustomElementChildType } from '@dojo/widget-core/registerCustomElement';

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
	onClick?(): void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<ButtonProperties>({
	tag: 'dojo-button',
	childType: CustomElementChildType.TEXT,
	properties: [ 'disabled', 'pressed', 'popup', 'theme', 'aria', 'extraClasses' ],
	attributes: [ 'id', 'name', 'value' ],
	events: [
		'onBlur',
		'onChange',
		'onClick',
		'onFocus',
		'onInput',
		'onKeyDown',
		'onKeyPress',
		'onKeyUp',
		'onMouseDown',
		'onMouseUp',
		'onTouchCancel',
		'onTouchEnd',
		'onTouchStart'
	]
})
export class ButtonBase<P extends ButtonProperties = ButtonProperties> extends ThemedBase<P> {
	private _onBlur (event: FocusEvent) {
		this.properties.onBlur && this.properties.onBlur();
	}
	private _onClick (event: MouseEvent) {
		event.stopPropagation();
		this.properties.onClick && this.properties.onClick();
	}
	private _onFocus (event: FocusEvent) {
		this.properties.onFocus && this.properties.onFocus();
	}
	private _onKeyDown (event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyDown && this.properties.onKeyDown(event.which, () => { event.preventDefault(); });
	}
	private _onKeyPress (event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyPress && this.properties.onKeyPress(event.which, () => { event.preventDefault(); });
	}
	private _onKeyUp (event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyUp && this.properties.onKeyUp(event.which, () => { event.preventDefault(); });
	}
	private _onMouseDown (event: MouseEvent) {
		event.stopPropagation();
		this.properties.onMouseDown && this.properties.onMouseDown();
	}
	private _onMouseUp (event: MouseEvent) {
		event.stopPropagation();
		this.properties.onMouseUp && this.properties.onMouseUp();
	}
	private _onTouchStart (event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchStart && this.properties.onTouchStart();
	}
	private _onTouchEnd (event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchEnd && this.properties.onTouchEnd();
	}
	private _onTouchCancel (event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchCancel && this.properties.onTouchCancel();
	}

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

	render(): DNode {
		let {
			aria = {},
			disabled,
			id,
			popup = false,
			name,
			pressed,
			type,
			value,
			theme
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
			popup ? v('span', { classes: this.theme(css.addon) }, [
				w(Icon, { type: 'downIcon', theme })
			]) : null
		]);
	}
}

export default class Button extends ButtonBase<ButtonProperties> {}
