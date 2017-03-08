import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import Label, { LabelOptions } from '../label/Label';
import { v, w } from '@dojo/widget-core/d';
import * as css from './styles/checkbox.css';

/**
 * @type CheckboxProperties
 *
 * Properties that can be set on a Checkbox component
 *
 * @property checked		Checked/unchecked property of the radio
 * @property describedBy	ID of an element that provides more descriptive text
 * @property disabled			Prevents the user from interacting with the form field
 * @property formId				ID of a form element associated with the form field
 * @property invalid			Indicates the valid is invalid, or required and not filled in
 * @property label				Label settings for form label text, position, and visibility
 * @property name					The form widget's name
 * @property readOnly			Allows or prevents user interaction
 * @property required			Whether or not a value is required
 * @property value				The current value
 * @property onBlur				Called when the input loses focus
 * @property onChange			Called when the node's 'change' event is fired
 * @property onClick			Called when the input is clicked
 * @property onFocus			Called when the input is focused
 * @property onMouseDown	Called on the input's mousedown event
 * @property onMouseUp		Called on the input's mouseup event
 * @property onTouchStart	Called on the input's touchstart event
 * @property onTouchEnd		Called on the input's touchend event
 * @property onTouchCancel	Called on the input's touchcancel event
 */
export interface CheckboxProperties extends ThemeableProperties {
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

export const CheckboxBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Checkbox extends CheckboxBase<CheckboxProperties> {
	onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	onChange (event: Event) { this.properties.onChange && this.properties.onChange(event); }
	onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	onMouseDown (event: MouseEvent) { this.properties.onMouseDown && this.properties.onMouseDown(event); }
	onMouseUp (event: MouseEvent) { this.properties.onMouseUp && this.properties.onMouseUp(event); }
	onTouchStart (event: TouchEvent) { this.properties.onTouchStart && this.properties.onTouchStart(event); }
	onTouchEnd (event: TouchEvent) { this.properties.onTouchEnd && this.properties.onTouchEnd(event); }
	onTouchCancel (event: TouchEvent) { this.properties.onTouchCancel && this.properties.onTouchCancel(event); }

	render() {
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

		const checkbox = v('div', { classes: this.classes(css.inputWrapper) }, [
			v('input', {
				bind: this,
				classes: this.classes(css.root),
				checked,
				'aria-describedby': describedBy,
				disabled,
				'aria-invalid': invalid + '',
				name,
				readOnly,
				'aria-readonly': readOnly ? 'true' : null,
				required,
				type: 'checkbox',
				value,
				onblur: this.onBlur,
				onchange: this.onChange,
				onclick: this.onClick,
				onfocus: this.onFocus,
				onmousedown: this.onMouseDown,
				onmouseup: this.onMouseUp,
				ontouchstart: this.onTouchStart,
				ontouchend: this.onTouchEnd,
				ontouchcancel: this.onTouchCancel
			})
		]);

		let checkboxWidget;

		if (label) {
			checkboxWidget = w(Label, {
				classes: this.classes(css.label, ...stateClasses),
				formId,
				label
			}, [ checkbox ]);
		}
		else {
			checkboxWidget = v('div', {
				classes: this.classes(...stateClasses)
			}, [ checkbox]);
		}

		return checkboxWidget;
	}
}
