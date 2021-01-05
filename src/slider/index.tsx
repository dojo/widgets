import { RenderResult } from '@dojo/framework/core/interfaces';
import focus from '@dojo/framework/core/middleware/focus';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import { formatAriaProperties } from '../common/util';
import Label from '../label/index';
import * as css from '../theme/default/slider.m.css';
import * as fixedCss from './styles/slider.m.css';

export interface SliderProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Set the disabled property of the control */
	disabled?: boolean;
	/** Adds the label element after (true) or before (false) */
	labelAfter?: boolean;
	/** Hides the label from view while still remaining accessible for screen readers */
	labelHidden?: boolean;
	/** The maximum value for the slider */
	max?: number;
	/** The minimum value for the slider */
	min?: number;
	/** The name of the input element */
	name?: string;
	/** Handler for when the element is blurred */
	onBlur?(): void;
	/** Handler for when the element is focused */
	onFocus?(): void;
	/** Handler for when the pointer moves out of the element */
	onOut?(): void;
	/** Handler for when the pointer moves over the element */
	onOver?(): void;
	/** Handler for when the value of the widget changes */
	onValue?(value?: number): void;
	/** If the rendered output should be displayed as a tooltip */
	outputIsTooltip?: boolean;
	/** Makes the slider readonly (it may be focused but not changed) */
	readOnly?: boolean;
	/** If the slider must be set */
	required?: boolean;
	/** Toggles visibility of slider output */
	showOutput?: boolean;
	/** Size of the slider increment */
	step?: number;
	/** If the value provided by the slider are valid */
	valid?: boolean;
	/** The initial value */
	initialValue?: number;
	/** A controlled slider value */
	value?: number;
	/** Orients the slider vertically, false by default. */
	vertical?: boolean;
	/** Length of the vertical slider (only used if vertical is true) */
	verticalHeight?: string;
	/** The id used for the form input element */
	widgetId?: string;
}

export interface SliderChildren {
	/** Adds a <label> element with the supplied text */
	label?: RenderResult;
	/** An optional function that returns a string or DNode for custom output format */
	output?(value: number): RenderResult;
}

export interface SliderICache {
	value?: number;
	initialValue?: number;
}

const factory = create({
	theme,
	focus,
	icache: createICacheMiddleware<SliderICache>()
})
	.properties<SliderProperties>()
	.children<SliderChildren | undefined>();

export const Slider = factory(function Slider({
	id,
	middleware: { theme, focus, icache },
	properties,
	children
}) {
	const {
		aria = {},
		disabled,
		widgetId = `slider-${id}}`,
		valid,
		labelAfter,
		labelHidden,
		max = 100,
		min = 0,
		name,
		readOnly,
		required,
		showOutput = true,
		step = 1,
		vertical = false,
		verticalHeight = '200px',
		outputIsTooltip = false,
		theme: themeProp,
		variant,
		classes,
		onOut,
		onOver,
		onBlur,
		onFocus,
		onValue
	} = properties();
	const [{ output, label } = { output: undefined, label: undefined }] = children();

	const { initialValue = min } = properties();
	let { value } = properties();

	if (value === undefined) {
		value = icache.get('value') || initialValue;
		const existingInitialValue = icache.getOrSet('initialValue', min);

		if (initialValue !== existingInitialValue) {
			value = initialValue;
			if (initialValue > max) {
				value = max;
			} else if (initialValue < min) {
				value = min;
			}

			icache.set('value', value);
			icache.set('initialValue', initialValue);
			onValue && onValue(value);
		}
	} else {
		if (value > max) {
			value = max;
		} else if (value < min) {
			value = min;
		}
		icache.set('value', value);
	}

	const themeCss = theme.classes(css);

	const percentValue = ((value - min) / (max - min)) * 100;

	let outputStyles: any = {};
	if (outputIsTooltip) {
		outputStyles = vertical ? { top: `${100 - percentValue}%` } : { left: `${percentValue}%` };
	}

	const slider = (
		<div
			classes={[themeCss.inputWrapper, fixedCss.inputWrapperFixed]}
			styles={vertical ? { height: verticalHeight } : {}}
		>
			<input
				key="input"
				{...formatAriaProperties(aria)}
				classes={[themeCss.input, fixedCss.nativeInput]}
				disabled={disabled}
				id={widgetId}
				focus={focus.shouldFocus}
				aria-invalid={valid === false ? 'true' : undefined}
				max={`${max}`}
				min={`${min}`}
				name={name}
				readOnly={readOnly}
				aria-readonly={readOnly ? 'true' : undefined}
				required={required}
				step={`${step}`}
				styles={vertical ? { width: verticalHeight } : {}}
				type="range"
				value={`${value}`}
				onblur={() => onBlur && onBlur()}
				onfocus={() => onFocus && onFocus()}
				onpointerenter={() => onOver && onOver()}
				onpointerleave={() => onOut && onOut()}
				oninput={(event: Event) => {
					event.stopPropagation();
					const value = parseFloat((event.target as HTMLInputElement).value);

					icache.set('value', value);
					onValue && onValue(value);
				}}
			/>
			<div
				classes={[themeCss.track, fixedCss.trackFixed]}
				aria-hidden="true"
				styles={vertical ? { width: verticalHeight } : {}}
			>
				<span
					classes={[themeCss.fill, fixedCss.fillFixed]}
					styles={{ width: `${percentValue}%` }}
				/>
				<span
					classes={[themeCss.thumb, fixedCss.thumbFixed]}
					styles={{ left: `${percentValue}%` }}
				/>
			</div>
			{showOutput ? (
				<output
					classes={[themeCss.output, outputIsTooltip ? themeCss.outputTooltip : null]}
					for={widgetId}
					styles={outputStyles}
					tabIndex={-1}
				>
					{output ? output(value) : `${value}`}
				</output>
			) : null}
		</div>
	);

	const content = [
		label ? (
			<Label
				theme={themeProp}
				classes={classes}
				variant={variant}
				disabled={disabled}
				focused={focus.shouldFocus()}
				valid={valid}
				readOnly={readOnly}
				required={required}
				hidden={labelHidden}
				secondary={true}
				forId={widgetId}
			>
				{label}
			</Label>
		) : null,
		slider
	];

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themeCss.root,
				disabled ? themeCss.disabled : null,
				focus.isFocused('input') ? themeCss.focused : null,
				valid === false ? themeCss.invalid : null,
				valid === true ? themeCss.valid : null,
				readOnly ? themeCss.readonly : null,
				vertical ? themeCss.vertical : null,
				fixedCss.rootFixed
			]}
		>
			{labelAfter ? content.reverse() : content}
		</div>
	);
});

export default Slider;
