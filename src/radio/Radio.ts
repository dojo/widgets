import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import Label, { LabelOptions } from '../label/Label';
import { v, w } from '@dojo/widget-core/d';
import * as css from './styles/radio.m.css';

/**
 * @type RadioProperties
 *
 * Properties that can be set on a Radio component
 *
 * @property checked          Checked/unchecked property of the radio
 * @property describedBy      ID of an element that provides more descriptive text
 * @property disabled         Prevents the user from interacting with the form field
 * @property formId           ID of a form element associated with the form field
 * @property invalid          Indicates the valid is invalid, or required and not filled in
 * @property label            Label settings for form label text, position, and visibility
 * @property name             The form widget's name
 * @property readOnly         Allows or prevents user interaction
 * @property required         Whether or not a value is required
 * @property value            The current value
 * @property onBlur           Called when the input loses focus
 * @property onChange         Called when the node's 'change' event is fired
 * @property onClick          Called when the input is clicked
 * @property onFocus          Called when the input is focused
 * @property onMouseDown      Called on the input's mousedown event
 * @property onMouseUp        Called on the input's mouseup event
 * @property onTouchStart     Called on the input's touchstart event
 * @property onTouchEnd       Called on the input's touchend event
 * @property onTouchCancel    Called on the input's touchcancel event
 */
export interface RadioProperties extends ThemeableProperties {
	checked?: boolean;
	describedBy?: string;
	disabled?: boolean;
	formId?: string;
	invalid?: boolean;
	label?: string | LabelOptions;
	name?: string;
	readOnly?: boolean;
	required?: boolean;
	value?: string;
	onBlur?(event: FocusEvent): void;
	onChange?(event: Event): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onMouseDown?(event: MouseEvent): void;
	onMouseUp?(event: MouseEvent): void;
	onTouchStart?(event: TouchEvent): void;
	onTouchEnd?(event: TouchEvent): void;
	onTouchCancel?(event: TouchEvent): void;
}

export const RadioBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Radio extends RadioBase<RadioProperties> {
	private _onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	private _onChange (event: Event) { this.properties.onChange && this.properties.onChange(event); }
	private _onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	private _onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	private _onMouseDown (event: MouseEvent) { this.properties.onMouseDown && this.properties.onMouseDown(event); }
	private _onMouseUp (event: MouseEvent) { this.properties.onMouseUp && this.properties.onMouseUp(event); }
	private _onTouchStart (event: TouchEvent) { this.properties.onTouchStart && this.properties.onTouchStart(event); }
	private _onTouchEnd (event: TouchEvent) { this.properties.onTouchEnd && this.properties.onTouchEnd(event); }
	private _onTouchCancel (event: TouchEvent) { this.properties.onTouchCancel && this.properties.onTouchCancel(event); }

	render(): DNode {
		const {
			checked = false,
			describedBy,
			disabled,
			formId,
			invalid,
			label,
			name,
			readOnly,
			required,
			value
		} = this.properties;

		const stateClasses = [
			checked ? css.checked : null,
			disabled ? css.disabled : null,
			invalid ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];

		const radio = v('div', { classes: this.classes(css.inputWrapper) }, [
			v('input', {
				bind: this,
				classes: this.classes(css.input),
				checked,
				'aria-describedby': describedBy,
				disabled,
				'aria-invalid': invalid ? 'true' : null,
				name,
				readOnly,
				'aria-readonly': readOnly ? 'true' : null,
				required,
				type: 'radio',
				value,
				onblur: this._onBlur,
				onchange: this._onChange,
				onclick: this._onClick,
				onfocus: this._onFocus,
				onmousedown: this._onMouseDown,
				onmouseup: this._onMouseUp,
				ontouchstart: this._onTouchStart,
				ontouchend: this._onTouchEnd,
				ontouchcancel: this._onTouchCancel
			})
		]);

		let radioWidget;

		if (label) {
			radioWidget = w(Label, {
				classes: this.classes(css.root, ...stateClasses),
				formId,
				label
			}, [ radio ]);
		}
		else {
			radioWidget = v('div', {
				classes: this.classes(css.root, ...stateClasses)
			}, [ radio]);
		}

		return radioWidget;
	}
}
