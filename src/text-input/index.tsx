import { RenderResult } from '@dojo/framework/core/interfaces';
import focus from '@dojo/framework/core/middleware/focus';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import theme from '../middleware/theme';
import validity from '@dojo/framework/core/middleware/validity';
import { create, diffProperty, invalidator, tsx } from '@dojo/framework/core/vdom';
import { formatAriaProperties } from '../common/util';
import HelperText from '../helper-text/index';
import Label from '../label/index';
import * as css from '../theme/default/text-input.m.css';

export type TextInputType =
	| 'text'
	| 'email'
	| 'number'
	| 'password'
	| 'search'
	| 'tel'
	| 'url'
	| 'date';

export interface BaseInputProperties<T extends { value: any } = { value: string }> {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Should the field autocomplete */
	autocomplete?: boolean | string;
	/** The disabled property of the input */
	disabled?: boolean;
	/** Text to display below the input */
	helperText?: string;
	/** Hides the label for a11y purposes */
	labelHidden?: boolean;
	/** The name property of the input */
	name?: string;
	/** Callback fired when the input is blurred */
	onBlur?(): void;
	/** Callback fired when the input is focused */
	onFocus?(): void;
	/** Callback fired when a key is pressed down */
	onKeyDown?(key: number, preventDefault: () => void): void;
	/** Callback fired when a key is released */
	onKeyUp?(key: number, preventDefault: () => void): void;
	/** Callback fired when the input validation changes */
	onValidate?: (valid: boolean | undefined, message: string) => void;
	/** Callback fired when the input value changes */
	onValue?(value?: T['value']): void;
	/** Callback fired when the input is clicked */
	onClick?(): void;
	/** Callback fired when the pointer enters the input */
	onOver?(): void;
	/** Callback fired when the pointer leaves the input */
	onOut?(): void;
	/** Placeholder text */
	placeholder?: string;
	/** The readonly attribute of the input */
	readOnly?: boolean;
	/** The required attribute of the input */
	required?: boolean;
	/** The initial value */
	initialValue?: T['value'];
	/** The controlled value */
	value?: T['value'];
	/** The id to be applied to the input */
	widgetId?: string;
	/** The kind of input */
	kind?: 'outlined' | 'default';
}

export interface TextInputChildren {
	/** The label to be displayed above the input */
	label?: RenderResult;
	/** Renderer for leading content */
	leading?: RenderResult;
	/** Renderer for trailing content */
	trailing?: RenderResult;
}

export interface TextInputProperties extends BaseInputProperties {
	/** Custom validator used to validate the contents of the input */
	customValidator?: (value: string) => { valid?: boolean; message?: string } | void;
	/** The min value a number can be */
	min?: number | string;
	/** The max value a number can be */
	max?: number | string;
	/** The step to increment the number value by */
	step?: number | string;
	/** Maximum number of characters allowed in the input */
	maxLength?: number | string;
	/** Minimum number of characters allowed in the input */
	minLength?: number | string;
	/** Pattern used as part of validation */
	pattern?: string | RegExp;
	/** Input type, e.g. text, email, tel, etc. */
	type?: TextInputType;
	/** Represents if the input value is valid */
	valid?: { valid?: boolean; message?: string } | boolean;
}

function formatAutocomplete(autocomplete: string | boolean | undefined): string | undefined {
	if (typeof autocomplete === 'boolean') {
		return autocomplete ? 'on' : 'off';
	}
	return autocomplete;
}

interface TextInputICache {
	uuid: string;
	dirty: boolean;
	value?: string;
	initialValue?: string;
	autofilled?: boolean;
}

const factory = create({
	theme,
	icache: createICacheMiddleware<TextInputICache>(),
	validity,
	focus,
	diffProperty,
	invalidator,
	dimensions
})
	.properties<TextInputProperties>()
	.children<TextInputChildren | undefined>();

export const TextInput = factory(function TextInput({
	middleware: { icache, theme, validity, focus, diffProperty, invalidator, dimensions },
	properties,
	children,
	id
}) {
	diffProperty('pattern', (previous: TextInputProperties, next: TextInputProperties) => {
		const value = next.pattern instanceof RegExp ? next.pattern.source : next.pattern;
		if (value !== previous.pattern) {
			invalidator();
		}
	});

	const themeCss = theme.classes(css);
	const dirty = icache.getOrSet('dirty', false);

	const {
		aria = {},
		autocomplete = false,
		classes,
		customValidator,
		disabled,
		helperText,
		labelHidden = false,
		max,
		maxLength,
		min,
		minLength,
		name,
		onBlur,
		onClick,
		onFocus,
		onKeyDown,
		onKeyUp,
		onOut,
		onOver,
		onValidate,
		onValue,
		pattern: patternValue,
		placeholder,
		readOnly,
		required,
		step,
		theme: themeProp,
		type = 'text',
		initialValue,
		valid: validValue = { valid: undefined, message: '' },
		widgetId = `text-input-${id}`,
		variant,
		kind = 'default'
	} = properties();

	let { value } = properties();
	const [{ label, leading, trailing } = {} as TextInputChildren] = children();

	if (value === undefined) {
		value = icache.get('value');
		const existingInitialValue = icache.get('initialValue');

		if (initialValue !== existingInitialValue) {
			icache.set('value', initialValue);
			icache.set('initialValue', initialValue);
			value = initialValue;
		}
	}

	const pattern = patternValue instanceof RegExp ? patternValue.source : patternValue;

	function _callOnValidate(valid: boolean | undefined, message: string) {
		let { valid: previousValid } = properties();
		let previousMessage: string | undefined;

		if (typeof previousValid === 'object') {
			previousMessage = previousValid.message;
			previousValid = previousValid.valid;
		}

		if (valid !== previousValid || message !== previousMessage) {
			onValidate && onValidate(valid, message);
		}
	}

	if (onValidate) {
		if (value === undefined && !dirty) {
			_callOnValidate(undefined, '');
		} else {
			icache.set('dirty', true);
			let { valid, message = '' } = validity.get('input', value || '');
			if (valid && customValidator) {
				const customValid = customValidator(value || '');
				if (customValid) {
					valid = customValid.valid;
					message = customValid.message || '';
				}
			}

			_callOnValidate(valid, message);
		}
	}

	const { valid, message } =
		typeof validValue === 'boolean' ? { valid: validValue, message: '' } : validValue;

	const computedHelperText = (valid === false && message) || helperText;
	const inputFocused = focus.isFocused('input');
	const autofilled = Boolean(icache.get('autofilled'));

	let {
		size: { width: labelWidth }
	} = dimensions.get('label');

	// When notched the label is transformed in the CSS to 75% size, then we need to add 10px of padding to get the desired look
	labelWidth = labelWidth * 0.75 + 10;

	function _renderLabel() {
		const labelActive = !!value || inputFocused || autofilled;

		const renderedLabel = (
			<span key="label" classes={themeCss.label}>
				<Label
					theme={themeProp}
					classes={classes}
					variant={variant}
					disabled={disabled}
					valid={valid}
					focused={inputFocused}
					readOnly={readOnly}
					required={required}
					hidden={labelHidden}
					forId={widgetId}
					active={labelActive}
				>
					{label}
				</Label>
			</span>
		);

		return kind === 'outlined' ? (
			<div classes={[themeCss.notchedOutline, labelActive && themeCss.notchedOutlineNotched]}>
				<div classes={themeCss.notchedOutlineLeading} />
				{label && (
					<div
						classes={themeCss.notchedOutlineNotch}
						styles={
							labelActive && labelWidth
								? { width: `${labelWidth}px` }
								: { width: 'auto' }
						}
					>
						{renderedLabel}
					</div>
				)}
				<div classes={themeCss.notchedOutlineTrailing} />
			</div>
		) : (
			label && renderedLabel
		);
	}

	return (
		<div key="root" classes={[theme.variant(), themeCss.root]} role="presentation">
			<div
				key="wrapper"
				classes={[
					themeCss.wrapper,
					disabled ? themeCss.disabled : null,
					inputFocused ? themeCss.focused : null,
					valid === false ? themeCss.invalid : null,
					valid === true ? themeCss.valid : null,
					readOnly ? themeCss.readonly : null,
					required ? themeCss.required : null,
					leading ? themeCss.hasLeading : null,
					trailing ? themeCss.hasTrailing : null,
					!label || labelHidden ? themeCss.noLabel : null,
					kind === 'outlined' ? themeCss.outlinedKind : null,
					kind === 'default' ? themeCss.defaultKind : null,
					kind === 'default' && inputFocused ? themeCss.defaultKindFocused : null
				]}
				role="presentation"
			>
				{_renderLabel()}
				{leading && <span classes={themeCss.leading}>{leading}</span>}
				{kind === 'default' && <span classes={themeCss.ripple} />}
				<input
					{...formatAriaProperties(aria)}
					aria-invalid={valid === false ? 'true' : undefined}
					autocomplete={formatAutocomplete(autocomplete)}
					classes={themeCss.input}
					disabled={disabled}
					id={widgetId}
					focus={focus.shouldFocus}
					key={'input'}
					max={max}
					maxlength={maxLength ? `${maxLength}` : null}
					min={min}
					minlength={minLength ? `${minLength}` : null}
					name={name}
					pattern={pattern}
					placeholder={placeholder}
					readOnly={readOnly}
					aria-readonly={readOnly ? 'true' : undefined}
					required={required}
					step={step}
					type={type}
					value={value}
					onblur={() => {
						onBlur && onBlur();
					}}
					onfocus={() => {
						onFocus && onFocus();
					}}
					oninput={(event: Event) => {
						event.stopPropagation();
						const value = (event.target as HTMLInputElement).value;
						icache.set('value', value);
						onValue && onValue(value);
					}}
					onkeydown={(event: KeyboardEvent) => {
						event.stopPropagation();
						onKeyDown && onKeyDown(event.which, () => event.preventDefault());
					}}
					onkeyup={(event: KeyboardEvent) => {
						event.stopPropagation();
						onKeyUp && onKeyUp(event.which, () => event.preventDefault());
					}}
					onclick={() => {
						onClick && onClick();
					}}
					onpointerenter={() => {
						onOver && onOver();
					}}
					onpointerleave={() => {
						onOut && onOut();
					}}
					onanimationstart={(event: AnimationEvent) => {
						if (event.animationName === themeCss.onAutofillShown) {
							icache.set('autofilled', true);
						}
					}}
				/>
				{kind === 'default' && (
					<span
						classes={[
							themeCss.lineRipple,
							inputFocused ? themeCss.defaultKindLineRippleFocused : null
						]}
					/>
				)}
				{trailing && <span classes={themeCss.trailing}>{trailing}</span>}
			</div>
			<HelperText
				text={computedHelperText}
				valid={valid}
				classes={classes}
				theme={themeProp}
				variant={variant}
			/>
		</div>
	);
});

export default TextInput;
