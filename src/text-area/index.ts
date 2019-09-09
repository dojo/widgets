import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { v, w } from '@dojo/framework/core/vdom';
import Focus from '@dojo/framework/core/meta/Focus';
import Label from '../label/index';
import {
	CustomAriaProperties,
	InputEventProperties,
	PointerEventProperties,
	KeyEventProperties
} from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/text-area.m.css';
import HelperText from '../helper-text/index';
import { InputValidity } from '@dojo/framework/core/meta/InputValidity';

/**
 * @type TextAreaProperties
 *
 * Properties that can be set on a TextInput component
 *
 * @property columns         Number of columns, controls the width of the textarea
 * @property rows            Number of rows, controls the height of the textarea
 * @property wrapText        Controls text wrapping. Can be "hard", "soft", or "off"
 * @property maxLength      Maximum number of characters allowed in the input
 * @property minLength      Minimum number of characters allowed in the input
 * @property placeholder    Placeholder text
 * @property value           The current value
 */
export interface TextAreaProperties
	extends ThemedProperties,
		FocusProperties,
		InputEventProperties,
		KeyEventProperties,
		PointerEventProperties,
		CustomAriaProperties {
	columns?: number;
	rows?: number;
	wrapText?: 'hard' | 'soft' | 'off';
	maxLength?: number | string;
	minLength?: number | string;
	placeholder?: string;
	value?: string;
	onClick?(value: string): void;
	valid?: { valid?: boolean; message?: string } | boolean;
	onValidate?: (valid: boolean | undefined, message: string) => void;
	customValidator?: (value: string) => { valid?: boolean; message?: string } | void;
	label?: string;
	labelHidden?: boolean;
	helperText?: string;
	disabled?: boolean;
	widgetId?: string;
	name?: string;
	readOnly?: boolean;
	required?: boolean;
}

@theme(css)
export class TextArea extends ThemedMixin(FocusMixin(WidgetBase))<TextAreaProperties> {
	private _dirty = false;

	private _onBlur(event: FocusEvent) {
		this.properties.onBlur && this.properties.onBlur((event.target as HTMLInputElement).value);
	}
	private _onChange(event: Event) {
		event.stopPropagation();
		this.properties.onChange &&
			this.properties.onChange((event.target as HTMLInputElement).value);
	}
	private _onClick(event: MouseEvent) {
		event.stopPropagation();
		this.properties.onClick &&
			this.properties.onClick((event.target as HTMLInputElement).value);
	}
	private _onFocus(event: FocusEvent) {
		this.properties.onFocus &&
			this.properties.onFocus((event.target as HTMLInputElement).value);
	}
	private _onInput(event: Event) {
		event.stopPropagation();
		this.properties.onInput &&
			this.properties.onInput((event.target as HTMLInputElement).value);
	}
	private _onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyDown &&
			this.properties.onKeyDown(event.which, () => {
				event.preventDefault();
			});
	}
	private _onKeyPress(event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyPress &&
			this.properties.onKeyPress(event.which, () => {
				event.preventDefault();
			});
	}
	private _onKeyUp(event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyUp &&
			this.properties.onKeyUp(event.which, () => {
				event.preventDefault();
			});
	}
	private _onMouseDown(event: MouseEvent) {
		event.stopPropagation();
		this.properties.onMouseDown && this.properties.onMouseDown();
	}
	private _onMouseUp(event: MouseEvent) {
		event.stopPropagation();
		this.properties.onMouseUp && this.properties.onMouseUp();
	}
	private _onTouchStart(event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchStart && this.properties.onTouchStart();
	}
	private _onTouchEnd(event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchEnd && this.properties.onTouchEnd();
	}
	private _onTouchCancel(event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchCancel && this.properties.onTouchCancel();
	}

	private _callOnValidate(valid: boolean | undefined, message: string) {
		let { valid: previousValid } = this.properties;
		let previousMessage: string | undefined;

		if (typeof previousValid === 'object') {
			previousMessage = previousValid.message;
			previousValid = previousValid.valid;
		}

		if (valid !== previousValid || message !== previousMessage) {
			this.properties.onValidate && this.properties.onValidate(valid, message);
		}
	}

	private _validate() {
		const { customValidator, value = '' } = this.properties;

		if (value === '' && !this._dirty) {
			this._callOnValidate(undefined, '');
			return;
		}

		this._dirty = true;
		let { valid, message = '' } = this.meta(InputValidity).get('input', value);
		if (valid && customValidator) {
			const customValid = customValidator(value);
			if (customValid) {
				valid = customValid.valid;
				message = customValid.message || '';
			}
		}
		this._callOnValidate(valid, message);
	}

	protected get validity() {
		const { valid = { valid: undefined, message: undefined } } = this.properties;

		if (typeof valid === 'boolean') {
			return { valid, message: undefined };
		}

		return {
			valid: valid.valid,
			message: valid.message
		};
	}

	private _uuid = uuid();

	protected getRootClasses(): (string | null)[] {
		const { disabled, readOnly, required } = this.properties;
		const focus = this.meta(Focus).get('root');
		const { valid } = this.validity;
		return [
			css.root,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			valid === false ? css.invalid : null,
			valid === true ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];
	}

	render(): DNode {
		const {
			aria = {},
			columns = 20,
			disabled,
			widgetId = this._uuid,
			label,
			maxLength,
			minLength,
			name,
			placeholder,
			readOnly,
			required,
			rows = 2,
			value,
			wrapText,
			theme,
			classes,
			labelHidden,
			helperText,
			onValidate
		} = this.properties;
		const focus = this.meta(Focus).get('root');

		onValidate && this._validate();
		const { valid, message } = this.validity;

		const computedHelperText = (valid === false && message) || helperText;

		return v(
			'div',
			{
				key: 'root',
				classes: this.theme(this.getRootClasses())
			},
			[
				label
					? w(
							Label,
							{
								theme,
								classes,
								disabled,
								focused: focus.containsFocus,
								invalid: valid === false || undefined,
								readOnly,
								required,
								hidden: labelHidden,
								forId: widgetId
							},
							[label]
					  )
					: null,
				v('div', { classes: this.theme(css.inputWrapper) }, [
					v('textarea', {
						id: widgetId,
						key: 'input',
						...formatAriaProperties(aria),
						classes: this.theme(css.input),
						cols: `${columns}`,
						disabled,
						focus: this.shouldFocus,
						'aria-invalid': valid === false ? 'true' : null,
						maxlength: maxLength ? `${maxLength}` : null,
						minlength: minLength ? `${minLength}` : null,
						name,
						placeholder,
						readOnly,
						'aria-readonly': readOnly ? 'true' : null,
						required,
						rows: `${rows}`,
						value,
						wrap: wrapText,
						onblur: this._onBlur,
						onchange: this._onChange,
						onclick: this._onClick,
						onfocus: this._onFocus,
						oninput: this._onInput,
						onkeydown: this._onKeyDown,
						onkeypress: this._onKeyPress,
						onkeyup: this._onKeyUp,
						onmousedown: this._onMouseDown,
						onmouseup: this._onMouseUp,
						ontouchstart: this._onTouchStart,
						ontouchend: this._onTouchEnd,
						ontouchcancel: this._onTouchCancel
					})
				]),
				w(HelperText, { text: computedHelperText, valid })
			]
		);
	}
}

export default TextArea;
