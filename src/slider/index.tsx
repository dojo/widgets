import { DNode } from '@dojo/framework/core/interfaces';
import focus from '@dojo/framework/core/middleware/focus';
import theme, { ThemeProperties } from '@dojo/framework/core/middleware/theme';
import { FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { create, tsx } from '@dojo/framework/core/vdom';
import { formatAriaProperties } from '../common/util';
import Label from '../label/index';
import * as css from '../theme/default/slider.m.css';
import * as fixedCss from './styles/slider.m.css';

export interface SliderProperties extends ThemeProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Set the disabled property of the control */
	disabled?: boolean;
	/** Adds a <label> element with the supplied text */
	label?: string;
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
	/** An optional function that returns a string or DNode for custom output format */
	output?(value: number): DNode;
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
	/** The current value */
	value?: number;
	/** Orients the slider vertically, false by default. */
	vertical?: boolean;
	/** Length of the vertical slider (only used if vertical is true) */
	verticalHeight?: string;
	/** The id used for the form input element */
	widgetId?: string;
}

const factory = create({ theme, focus }).properties<SliderProperties>();

export const Slider = factory(function Slider({ id, middleware: { theme, focus }, properties }) {
	const {
		aria = {},
		disabled,
		widgetId = `slider-${id}}`,
		valid,
		label,
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
		theme: themeProp,
		classes,
		onOut,
		onOver,
		onBlur,
		onFocus,
		onValue
	} = properties();

	let { value = min } = properties();
	const themeCss = theme.classes(css);
	const themeFixedCss = theme.classes(fixedCss);

	value = value > max ? max : value;
	value = value < min ? min : value;

	const percentValue = ((value - min) / (max - min)) * 100;

	const renderOutput = (value: number, percentValue: number) => {
		const { output, outputIsTooltip = false, vertical = false } = properties();

		const outputNode = output ? output(value) : `${value}`;

		// output styles
		let outputStyles: { left?: string; top?: string } = {};
		if (outputIsTooltip) {
			outputStyles = vertical
				? { top: `${100 - percentValue}%` }
				: { left: `${percentValue}%` };
		}

		return (
			<output
				classes={[themeCss.output, outputIsTooltip ? themeCss.outputTooltip : null]}
				for={widgetId}
				styles={outputStyles}
				tabIndex={-1}
			>
				{outputNode}
			</output>
		);
	};

	const slider = (
		<div
			classes={[themeCss.inputWrapper, themeFixedCss.inputWrapperFixed]}
			styles={vertical ? { height: verticalHeight } : {}}
		>
			<input
				key="input"
				{...formatAriaProperties(aria)}
				classes={[themeCss.input, themeFixedCss.nativeInput]}
				disabled={disabled}
				id={widgetId}
				focus={focus.shouldFocus}
				aria-invalid={valid === false ? 'true' : null}
				max={`${max}`}
				min={`${min}`}
				name={name}
				readOnly={readOnly}
				aria-readonly={readOnly ? 'true' : null}
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
					const value = (event.target as HTMLInputElement).value;

					onValue && onValue(parseFloat(value));
				}}
			/>
			<div
				classes={[themeCss.track, themeFixedCss.trackFixed]}
				aria-hidden="true"
				styles={vertical ? { width: verticalHeight } : {}}
			>
				<span
					classes={[themeCss.fill, themeFixedCss.fillFixed]}
					styles={{ width: `${percentValue}%` }}
				/>
				<span
					classes={[themeCss.thumb, themeFixedCss.thumbFixed]}
					styles={{ left: `${percentValue}%` }}
				/>
			</div>
			{showOutput ? renderOutput(value, percentValue) : null}
		</div>
	);

	const children = [
		label ? (
			<Label
				theme={themeProp}
				classes={classes}
				disabled={disabled}
				focused={focus.shouldFocus()}
				valid={valid}
				readOnly={readOnly}
				required={required}
				hidden={labelHidden}
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
				css.root,
				disabled ? css.disabled : null,
				focus.isFocused('input') ? css.focused : null,
				valid === false ? css.invalid : null,
				valid === true ? css.valid : null,
				readOnly ? css.readonly : null,
				vertical ? css.vertical : null,
				themeFixedCss.rootFixed
			]}
		>
			{labelAfter ? children.reverse() : children}
		</div>
	);
});

export default Slider;
