import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode, PropertyChangeRecord } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v, w } from '@dojo/framework/core/vdom';
import Focus from '@dojo/framework/core/meta/Focus';
import InputValidity from '@dojo/framework/core/meta/InputValidity';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Label from '../label/index';
import { formatAriaProperties } from '../common/util';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/text-input.m.css';
import diffProperty from '@dojo/framework/core/decorators/diffProperty';
import { reference } from '@dojo/framework/core/diff';
import HelperText from '../helper-text/index';

export type TextInputType =
	| 'text'
	| 'email'
	| 'number'
	| 'password'
	| 'search'
	| 'tel'
	| 'url'
	| 'date';

interface TextInputInternalState {
	dirty?: boolean;
}

/**
 * @type IconProperties
 *
 * Properties that can be set on a TextInput component
 *
 * @property controls       ID of an element that this input controls
 * @property type           Input type, e.g. text, email, tel, etc.
 * @property maxLength      Maximum number of characters allowed in the input
 * @property minLength      Minimum number of characters allowed in the input
 * @property placeholder    Placeholder text
 * @property value          The current value
 * @property leading		Renderer for leading icon content
 * @property trailing		Renderer for trailing icon content
 */

export interface TextInputProperties extends ThemedProperties, FocusProperties {
	aria?: { [key: string]: string | null };
	onBlur?(): void;
	onFocus?(): void;
	onValue?(value?: string): void;
	onKey?(key: number, preventDefault: () => void): void;
	disabled?: boolean;
	widgetId?: string;
	name?: string;
	readOnly?: boolean;
	required?: boolean;
	controls?: string;
	type?: TextInputType;
	maxLength?: number | string;
	minLength?: number | string;
	placeholder?: string;
	helperText?: string;
	value?: string;
	valid?: { valid?: boolean; message?: string } | boolean;
	customValidator?: (value: string) => { valid?: boolean; message?: string } | void;
	pattern?: string | RegExp;
	autocomplete?: boolean | string;
	onClick?(value: string): void;
	onValidate?: (valid: boolean | undefined, message: string) => void;
	leading?: () => DNode;
	trailing?: () => DNode;
	labelHidden?: boolean;
	label?: string;
}

function formatAutocomplete(autocomplete: string | boolean | undefined): string | undefined {
	if (typeof autocomplete === 'boolean') {
		return autocomplete ? 'on' : 'off';
	}
	return autocomplete;
}

function patternDiffer(
	previousProperty: string | undefined,
	newProperty: string | RegExp | undefined
): PropertyChangeRecord {
	const value = newProperty instanceof RegExp ? newProperty.source : newProperty;
	return {
		changed: previousProperty !== value,
		value
	};
}

@theme(css)
@diffProperty('pattern', patternDiffer)
@diffProperty('leading', reference)
@diffProperty('trailing', reference)
export class TextInput extends ThemedMixin(FocusMixin(WidgetBase))<TextInputProperties> {
	private _onBlur() {
		this.properties.onBlur && this.properties.onBlur();
	}
	private _onFocus() {
		this.properties.onFocus && this.properties.onFocus();
	}
	private _onInput(event: Event) {
		event.stopPropagation();
		this.properties.onValue &&
			this.properties.onValue((event.target as HTMLInputElement).value);
	}

	private _onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKey &&
			this.properties.onKey(event.which, () => {
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
		const { dirty = false } = this._state;
		if (value === '' && !dirty) {
			this._callOnValidate(undefined, '');
			return;
		}

		this._state.dirty = true;
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
	private _state: TextInputInternalState = {};

	protected getRootClasses(): (string | null)[] {
		const { disabled, readOnly, required, leading, trailing } = this.properties;
		const { valid } = this.validity;
		const focus = this.meta(Focus).get('root');
		return [
			css.root,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			valid === false ? css.invalid : null,
			valid === true ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null,
			leading ? css.hasLeading : null,
			trailing ? css.hasTrailing : null
		];
	}

	protected render(): DNode {
		const {
			aria = {},
			autocomplete,
			classes,
			disabled,
			label,
			labelHidden = false,
			leading,
			maxLength,
			minLength,
			name,
			pattern,
			placeholder,
			readOnly,
			required,
			theme,
			trailing,
			type = 'text',
			value,
			widgetId = this._uuid,
			helperText,
			onValidate
		} = this.properties;

		onValidate && this._validate();
		const { valid, message } = this.validity;

		const focus = this.meta(Focus).get('root');

		const computedHelperText = (valid === false && message) || helperText;

		return v(
			'div',
			{
				key: 'root',
				classes: this.theme(this.getRootClasses()),
				role: 'presentation'
			},
			[
				label &&
					w(
						Label,
						{
							theme,
							classes,
							disabled,
							valid,
							focused: focus.containsFocus,
							readOnly,
							required,
							hidden: labelHidden,
							forId: widgetId
						},
						[label]
					),
				v(
					'div',
					{
						key: 'inputWrapper',
						classes: this.theme(css.inputWrapper),
						role: 'presentation'
					},
					[
						leading &&
							v('span', { key: 'leading', classes: this.theme(css.leading) }, [
								leading()
							]),
						v('input', {
							...formatAriaProperties(aria),
							'aria-invalid': valid === false ? 'true' : null,
							autocomplete: formatAutocomplete(autocomplete),
							classes: this.theme(css.input),
							disabled,
							id: widgetId,
							focus: this.shouldFocus,
							key: 'input',
							maxlength: maxLength ? `${maxLength}` : null,
							minlength: minLength ? `${minLength}` : null,
							name,
							pattern,
							placeholder,
							readOnly,
							'aria-readonly': readOnly ? 'true' : null,
							required,
							type,
							value,
							onblur: this._onBlur,
							onfocus: this._onFocus,
							oninput: this._onInput,
							onkeydown: this._onKeyDown
						}),
						trailing &&
							v('span', { key: 'trailing', classes: this.theme(css.trailing) }, [
								trailing()
							])
					]
				),
				w(HelperText, { text: computedHelperText, valid })
			]
		);
	}
}

export default TextInput;
