import { create, tsx } from '@dojo/framework/core/vdom';
import Label from '../label/index';
import { formatAriaProperties } from '../common/util';
import * as css from '../theme/default/text-area.m.css';
import HelperText from '../helper-text/index';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme, { ThemeProperties } from '@dojo/framework/core/middleware/theme';
import focus from '@dojo/framework/core/middleware/focus';
import { FocusProperties } from '@dojo/framework/core/mixins/Focus';
import validity from '@dojo/framework/core/middleware/validity';

export interface TextAreaProperties extends ThemeProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Number of columns, controls the width of the textarea */
	columns?: number;
	/** Custom validator used to validate the contents of the TextArea */
	customValidator?: (value: string) => { valid?: boolean; message?: string } | void;
	/** Set the disabled property of the control */
	disabled?: boolean;
	/** Renders helper text to the user */
	helperText?: string;
	/** Adds a <label> element with the supplied text */
	label?: string;
	/** Hides the label from view while still remaining accessible for screen readers */
	labelHidden?: boolean;
	/** Maximum number of characters allowed in the input */
	maxLength?: number | string;
	/** Minimum number of characters allowed in the input */
	minLength?: number | string;
	/** The name of the field */
	name?: string;

	/** Handler for when the element is blurred */
	onBlur?(): void;

	/** Handler of when the element is clicked */
	onClick?(): void;

	/** Handler for when the element is focused */
	onFocus?(): void;

	/** Handler for when a key is depressed in the element */
	onKeyDown?(key: number, preventDefault: () => void): void;

	/** Handler for when a key is released in the element */
	onKeyUp?(key: number, preventDefault: () => void): void;

	/** Handler for when the pointer moves out of the element */
	onOut?(): void;

	/** Handler for when the pointer moves over the element */
	onOver?(): void;

	/** Called when TextArea's state is validated */
	onValidate?: (valid: boolean | undefined, message: string) => void;

	/** Handler for when the value of the widget changes */
	onValue?(value?: string): void;

	/** Placeholder text displayed in an empty TextArea */
	placeholder?: string;
	/** Makes the field readonly (it may be focused but not changed) */
	readOnly?: boolean;
	/** Sets the input as required to complete the form */
	required?: boolean;
	/** Number of rows, controls the height of the textarea */
	rows?: number;
	/** If the field is valid and optionally display a message */
	valid?: { valid?: boolean; message?: string } | boolean;
	/** The initial value */
	initialValue?: string;
	/** The id used for the form input element */
	widgetId?: string;
	/** Controls text wrapping. Can be "hard", "soft", or "off" */
	wrapText?: 'hard' | 'soft' | 'off';
}

export interface TextAreaICache {
	dirty: boolean;
	value?: string;
	initialValue?: string;
}

const factory = create({
	icache: createICacheMiddleware<TextAreaICache>(),
	theme,
	focus,
	validity
}).properties<TextAreaProperties>();
export const TextArea = factory(function TextArea({
	id,
	middleware: { icache, theme, focus, validity },
	properties
}) {
	const themeCss = theme.classes(css);

	function callOnValidate(valid: boolean | undefined, message: string) {
		let { valid: previousValid, onValidate } = properties();
		let previousMessage: string | undefined;

		if (typeof previousValid === 'object') {
			previousMessage = previousValid.message;
			previousValid = previousValid.valid;
		}

		if (valid !== previousValid || message !== previousMessage) {
			onValidate && onValidate(valid, message);
		}
	}

	function validate() {
		const { customValidator } = properties();
		const value = icache.get('value') || '';
		const dirty = icache.getOrSet('dirty', false);

		if (value === '' && !dirty) {
			callOnValidate(undefined, '');
			return;
		}

		icache.set('dirty', true);

		let { valid, message = '' } = validity.get('input', value || '');
		if (valid && customValidator) {
			const customValid = customValidator(value);
			if (customValid) {
				valid = customValid.valid;
				message = customValid.message || '';
			}
		}

		callOnValidate(valid, message);
	}

	function getValidity() {
		const { valid = { valid: undefined, message: undefined } } = properties();

		if (typeof valid === 'boolean') {
			return { valid, message: undefined };
		}

		return {
			valid: valid.valid,
			message: valid.message
		};
	}

	const {
		aria = {},
		columns = 20,
		disabled,
		widgetId = `textarea-${id}`,
		label,
		maxLength,
		minLength,
		name,
		placeholder,
		readOnly,
		required,
		rows = 2,
		initialValue,
		wrapText,
		theme: themeProp,
		classes,
		labelHidden,
		helperText,
		onValidate,
		onValue
	} = properties();

	let value = icache.get('value');
	const existingInitialValue = icache.get('initialValue');

	if (initialValue !== existingInitialValue) {
		icache.set('value', initialValue);
		icache.set('initialValue', initialValue);
		value = initialValue;

		onValue && onValue(initialValue);
	}

	onValidate && validate();
	const { valid, message } = getValidity();

	const computedHelperText = (valid === false && message) || helperText;

	return (
		<div
			key="root"
			classes={[
				themeCss.root,
				disabled ? themeCss.disabled : null,
				valid === false ? themeCss.invalid : null,
				valid === true ? themeCss.valid : null,
				readOnly ? themeCss.readonly : null,
				required ? themeCss.required : null,
				focus.isFocused('input') ? themeCss.focused : null
			]}
		>
			{label ? (
				<Label
					theme={themeProp}
					classes={classes}
					disabled={disabled}
					valid={valid}
					readOnly={readOnly}
					required={required}
					hidden={labelHidden}
					forId={widgetId}
					focused={focus.isFocused('input')}
					active={!!value || focus.isFocused('input')}
				>
					{label}
				</Label>
			) : null}
			<div classes={themeCss.inputWrapper}>
				<textarea
					id={widgetId}
					key="input"
					{...formatAriaProperties(aria)}
					classes={themeCss.input}
					cols={`${columns}`}
					disabled={disabled}
					focus={focus.shouldFocus}
					aria-invalid={valid === false ? 'true' : null}
					maxlength={maxLength ? `${maxLength}` : null}
					minlength={minLength ? `${minLength}` : null}
					name={name}
					placeholder={placeholder}
					readOnly={readOnly}
					aria-readonly={readOnly ? 'true' : null}
					required={required}
					rows={`${rows}`}
					value={value}
					wrap={wrapText}
					onblur={() => {
						const { onBlur } = properties();
						onBlur && onBlur();
					}}
					onfocus={() => {
						const { onFocus } = properties();
						onFocus && onFocus();
					}}
					oninput={(event: Event) => {
						const { onValue } = properties();
						event.stopPropagation();
						const value = (event.target as HTMLInputElement).value;
						icache.set('value', value);
						onValue && onValue(value);
					}}
					onkeydown={(event: KeyboardEvent) => {
						const { onKeyDown } = properties();
						event.stopPropagation();
						onKeyDown &&
							onKeyDown(event.which, () => {
								event.preventDefault();
							});
					}}
					onkeyup={(event: KeyboardEvent) => {
						const { onKeyUp } = properties();
						event.stopPropagation();
						onKeyUp &&
							onKeyUp(event.which, () => {
								event.preventDefault();
							});
					}}
					onclick={() => {
						const { onClick } = properties();
						onClick && onClick();
					}}
					onpointerenter={() => {
						const { onOver } = properties();
						onOver && onOver();
					}}
					onpointerleave={() => {
						const { onOut } = properties();
						onOut && onOut();
					}}
				/>
			</div>
			<HelperText
				text={computedHelperText}
				valid={valid}
				classes={classes}
				theme={themeProp}
			/>
		</div>
	);
});

export default TextArea;
