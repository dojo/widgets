import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import Label, { LabelOptions } from '../label/Label';
import * as css from './styles/textinput.css';

export type TextInputType = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url';

/**
 * @type TextInputProperties
 *
 * Properties that can be set on a TextInput component
 *
 * @property describedBy	ID of an element that provides more descriptive text
 * @property disabled			Prevents the user from interacting with the form field
 * @property formId				ID of a form element associated with the form field
 * @property invalid			Indicates the value entered in the form field is invalid
 * @property label				Label settings for form label text, position, and visibility
 * @property maxLength		Maximum number of characters allowed in the input
 * @property minLength		Minimum number of characters allowed in the input
 * @property name					The form widget's name
 * @property placeholder	Placeholder text
 * @property readOnly			Allows or prevents user interaction
 * @property required			Whether or not a value is required
 * @property type					Input type, e.g. text, email, tel, etc.
 * @property value				The current value
 * @property onBlur				Called when the input loses focus
 * @property onChange			Called when the node's 'change' event is fired
 * @property onClick			Called when the input is clicked
 * @property onFocus			Called when the input is focused
 * @property onInput			Called when the 'input' event is fired
 * @property onKeyDown		Called on the input's keydown event
 * @property onKeyPress		Called on the input's keypress event
 * @property onKeyUp			Called on the input's keyup event
 * @property onMouseDown	Called on the input's mousedown event
 * @property onMouseUp		Called on the input's mouseup event
 * @property onTouchStart	Called on the input's touchstart event
 * @property onTouchEnd		Called on the input's touchend event
 * @property onTouchCancel	Called on the input's touchcancel event
 */
export interface TextInputProperties extends ThemeableProperties {
	describedBy?: string;
	disabled?: boolean;
	formId?: string;
	invalid?: boolean;
	label?: string | LabelOptions;
	maxLength?: number | string;
	minLength?: number | string;
	name?: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	type?: TextInputType;
	value?: string;
	onBlur?(event: FocusEvent): void;
	onChange?(event: Event): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onInput?(event: Event): void;
	onKeyDown?(event: KeyboardEvent): void;
	onKeyPress?(event: KeyboardEvent): void;
	onKeyUp?(event: KeyboardEvent): void;
	onMouseDown?(event: MouseEvent): void;
	onMouseUp?(event: MouseEvent): void;
	onTouchStart?(event: TouchEvent): void;
	onTouchEnd?(event: TouchEvent): void;
	onTouchCancel?(event: TouchEvent): void;
}

const TextInputBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class TextInput extends TextInputBase<TextInputProperties> {
	render() {
		const {
			describedBy,
			disabled,
			formId,
			invalid,
			label,
			maxLength,
			minLength,
			name,
			placeholder,
			readOnly,
			required,
			type = 'text',
			value,
			onBlur,
			onChange,
			onClick,
			onFocus,
			onInput,
			onKeyDown,
			onKeyPress,
			onKeyUp,
			onMouseDown,
			onMouseUp,
			onTouchStart,
			onTouchEnd,
			onTouchCancel
		} = this.properties;

		const labelClasses = [
			css.label,
			typeof invalid === 'boolean' ? invalid ? css.invalid : css.valid : null
		];

		const textinput = v('input', {
			classes: this.classes(css.root).get(),
			'aria-describedby': describedBy,
			disabled,
			'aria-invalid': invalid,
			maxlength: maxLength ? maxLength + '' : null,
			minlength: minLength ? minLength + '' : null,
			name,
			placeholder,
			readOnly,
			'aria-readonly': readOnly ? 'true' : null,
			required,
			type,
			value,
			onblur: onBlur,
			onchange: onChange,
			onclick: onClick,
			onfocus: onFocus,
			oninput: onInput,
			onkeydown: onKeyDown,
			onkeypress: onKeyPress,
			onkeyup: onKeyUp,
			onmousedown: onMouseDown,
			onmouseup: onMouseUp,
			ontouchstart: onTouchStart,
			ontouchend: onTouchEnd,
			ontouchcancel: onTouchCancel
		});

		let textinputWidget;

		if (label) {
			textinputWidget = w(Label, {
				classes: this.classes(...labelClasses).get(),
				formId,
				label
			}, [ textinput ]);
		}
		else {
			textinputWidget = textinput;
		}

		return textinputWidget;
	}
}
