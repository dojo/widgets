import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode, PropertyChangeRecord } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v, w } from '@dojo/framework/core/vdom';
import Focus from '@dojo/framework/core/meta/Focus';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Label from '../label/index';
import {
	CustomAriaProperties,
	PointerEventProperties,
	KeyEventProperties,
	InputEventProperties
} from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/text-input.m.css';
import { customElement } from '@dojo/framework/core/decorators/customElement';
import diffProperty from '@dojo/framework/core/decorators/diffProperty';
import { reference } from '@dojo/framework/core/diff';
import InputValidity from '../common/InputValidity';
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
	previousValue?: string;
	previousValid?: boolean;
	previousMessage?: string;
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

export interface TextInputProperties
	extends ThemedProperties,
		FocusProperties,
		PointerEventProperties,
		KeyEventProperties,
		InputEventProperties,
		CustomAriaProperties {
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
@customElement<TextInputProperties>({
	tag: 'dojo-text-input',
	properties: [
		'theme',
		'classes',
		'aria',
		'extraClasses',
		'disabled',
		'readOnly',
		'labelHidden',
		'valid',
		'leading',
		'trailing'
	],
	attributes: [
		'widgetId',
		'label',
		'placeholder',
		'helperText',
		'controls',
		'type',
		'minLength',
		'maxLength',
		'value',
		'name',
		'pattern',
		'autocomplete'
	],
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
		'onTouchStart',
		'onValidate'
	]
})
@diffProperty('pattern', patternDiffer)
@diffProperty('leading', reference)
@diffProperty('trailing', reference)
export class TextInput extends ThemedMixin(FocusMixin(WidgetBase))<TextInputProperties> {
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

	private _validate() {
		const {
			_state: state,
			properties: { onValidate, value, customValidator }
		} = this;

		if (!onValidate || value === undefined || value === null || state.previousValue === value) {
			return;
		}

		state.previousValue = value;

		let { valid, message = '' } = this.meta(InputValidity).get('input', value);

		if (valid && customValidator) {
			const customValid = customValidator(value);
			if (customValid) {
				valid = customValid.valid;
				message = customValid.message || '';
			}
		}

		if (valid === state.previousValid && message === state.previousMessage) {
			return;
		}

		state.previousValid = valid;
		state.previousMessage = message;

		onValidate(valid, message);
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
			helperText
		} = this.properties;

		this._validate();
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
							invalid: valid === false || undefined,
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
