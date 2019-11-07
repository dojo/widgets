import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { v, w } from '@dojo/framework/core/vdom';
import Focus from '../meta/Focus';
import Label from '../label/index';
import { formatAriaProperties } from '../common/util';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/text-area.m.css';
import HelperText from '../helper-text/index';
import { InputValidity } from '@dojo/framework/core/meta/InputValidity';

export interface TextAreaProperties extends ThemedProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Number of columns, controls the width of the textarea */
	columns?: number;
	/**  */
	customValidator?: (value: string) => { valid?: boolean; message?: string } | void;
	/**  */
	disabled?: boolean;
	/**  */
	helperText?: string;
	/**  */
	label?: string;
	/**  */
	labelHidden?: boolean;
	/** Maximum number of characters allowed in the input */
	maxLength?: number | string;
	/** Minimum number of characters allowed in the input */
	minLength?: number | string;
	/**  */
	name?: string;
	/**  */
	onBlur?(): void;
	/**  */
	onClick?(): void;
	/**  */
	onFocus?(): void;
	/**  */
	onKeyDown?(key: number, preventDefault: () => void): void;
	/**  */
	onKeyUp?(key: number, preventDefault: () => void): void;
	/**  */
	onOut?(): void;
	/**  */
	onOver?(): void;
	/**  */
	onValidate?: (valid: boolean | undefined, message: string) => void;
	/**  */
	onValue?(value?: string): void;
	/** Placeholder text */
	placeholder?: string;
	/**  */
	readOnly?: boolean;
	/**  */
	required?: boolean;
	/** Number of rows, controls the height of the textarea */
	rows?: number;
	/**  */
	valid?: { valid?: boolean; message?: string } | boolean;
	/** The current value */
	value?: string;
	/**  */
	widgetId?: string;
	/** Controls text wrapping. Can be "hard", "soft", or "off" */
	wrapText?: 'hard' | 'soft' | 'off';
}

@theme(css)
export class TextArea extends ThemedMixin(FocusMixin(WidgetBase))<TextAreaProperties> {
	private _dirty = false;

	private _onInput(event: Event) {
		event.stopPropagation();
		this.properties.onValue &&
			this.properties.onValue((event.target as HTMLInputElement).value);
	}

	private _onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyDown &&
			this.properties.onKeyDown(event.which, () => {
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
			onValidate,
			onBlur,
			onFocus,
			onClick,
			onOver,
			onOut
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
								valid,
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
						onblur: () => {
							onBlur && onBlur();
						},
						onfocus: () => {
							onFocus && onFocus();
						},
						oninput: this._onInput,
						onkeydown: this._onKeyDown,
						onkeyup: this._onKeyUp,
						onclick: () => {
							onClick && onClick();
						},
						onpointerenter: () => {
							onOver && onOver();
						},
						onpointerleave: () => {
							onOut && onOut();
						}
					})
				]),
				w(HelperText, { text: computedHelperText, valid })
			]
		);
	}
}

export default TextArea;
