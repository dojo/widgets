import * as baseCss from '../common/styles/base.m.css';
import * as css from '../theme/default/range-slider.m.css';
import * as fixedCss from './styles/range-slider.m.css';
import Label from '../label/index';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import focus from '@dojo/framework/core/middleware/focus';
import theme from '../middleware/theme';
import { RenderResult, AriaAttributes } from '@dojo/framework/core/interfaces';
import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { formatAriaProperties } from '../common/util';

type RangeValue = { min: number; max: number };

export interface RangeSliderProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Set the disabled property of the control */
	disabled?: boolean;
	/** Hides the label from view while still remaining accessible for screen readers */
	labelHidden?: boolean;
	/** The maximum value allowed */
	max?: number;
	/** The label displayed at the maximum range */
	maximumLabel?: string;
	/** The name of the max slider */
	maxName?: string;
	/** The minimum value allowed */
	min?: number;
	/** The label displayed at the minimum range */
	minimumLabel?: string;
	/** The name of the minimum range */
	minName?: string;
	/** The name of the slider input */
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
	onValue?(value: RangeValue): void;
	/** If the rendered output should be displayed as a tooltip */
	outputIsTooltip?: boolean;
	/** Makes the slider readonly (it may be focused but not changed) */
	readOnly?: boolean;
	/** If the range slider must be set */
	required?: boolean;
	/** If the rendered output should be displayed */
	showOutput?: boolean;
	/** The amount which the slider may be changed */
	step?: number;
	/** If the values provided by the slider are valid */
	valid?: boolean;
	/** The initial value of the range slider */
	initialValue?: RangeValue;
	/** A controlled value for the range slider */
	value?: RangeValue;
	/** The id used for the form input element */
	widgetId?: string;
}

export interface RangeSliderChildren {
	/** Adds a <label> element with the supplied text */
	label?: RenderResult;
	/** A renderer used to display the output values (min, max) */
	output?(value: RangeValue): RenderResult;
}

export interface RangeSliderICache {
	initialValue?: RangeValue;
	value?: RangeValue;
	focused: boolean;
}

const factory = create({
	dimensions,
	focus,
	icache: createICacheMiddleware<RangeSliderICache>(),
	theme
})
	.properties<RangeSliderProperties>()
	.children<RangeSliderChildren | undefined>();

export const RangeSlider = factory(function RangeSlider({
	children,
	id,
	middleware: { dimensions, focus, icache, theme },
	properties
}) {
	const { name = '', max: maxRestraint = 100, min: minRestraint = 0 } = properties();

	const [{ label, output } = {} as RangeSliderChildren] = children();
	const {
		aria = {},
		classes,
		disabled,
		labelHidden,
		maxName = `${name}_max`,
		maximumLabel = 'Maximum',
		minName = `${name}_min`,
		minimumLabel = 'Minimum',
		onBlur,
		onFocus,
		onOut,
		onOver,
		onValue,
		outputIsTooltip,
		readOnly,
		required,
		showOutput = false,
		step = 1,
		theme: themeProp,
		valid,
		variant,
		initialValue = {
			max: maxRestraint,
			min: minRestraint
		},
		widgetId = `range-slider-${id}`
	} = properties();

	let { value } = properties();

	if (value === undefined) {
		value = icache.get('value');
		const existingInitialValue = icache.get('initialValue');
		if (
			!existingInitialValue ||
			initialValue.min !== existingInitialValue.min ||
			initialValue.max !== existingInitialValue.max
		) {
			icache.set('value', initialValue);
			icache.set('initialValue', initialValue);
			value = initialValue;
		}
	}

	const themeCss = theme.classes(css);
	const size = dimensions.get('root');
	const isFocused = icache.getOrSet('focused', false);

	const maxLabelId = `max-label-${id}`;
	const minLabelId = `min-label-${id}`;

	const min = Math.max((value || initialValue).min, minRestraint);
	const max = Math.min((value || initialValue).max, maxRestraint);
	const slider1Percent = (min - minRestraint) / (maxRestraint - minRestraint);
	const slider2Percent = (max - minRestraint) / (maxRestraint - minRestraint);
	const slider1Size = slider1Percent + (slider2Percent - slider1Percent) / 2;
	const slider2Size = 1 - slider1Size;

	const getInputProperties = (isSlider1: boolean) => ({
		...formatAriaProperties(aria),
		'aria-describedby': isSlider1 ? minLabelId : maxLabelId,
		'aria-invalid': (valid === false ? 'true' : undefined) as AriaAttributes['aria-invalid'],
		'aria-labelledby': `${widgetId}-label`,
		'aria-readonly': (readOnly === true
			? 'true'
			: undefined) as AriaAttributes['aria-readonly'],
		classes: [themeCss.input, fixedCss.nativeInput],
		disabled,
		max: `${maxRestraint}`,
		min: `${minRestraint}`,
		name: isSlider1 ? minName : maxName,
		onblur: () => {
			icache.set('focused', false);
			onBlur && onBlur();
		},
		onfocus: () => {
			icache.set('focused', true);
			onFocus && onFocus();
		},
		oninput: (event: Event) => {
			onInput(event, isSlider1);
		},
		readonly: readOnly,
		required,
		step: `${step}`,
		type: 'range'
	});

	const onInput = (event: Event, isMinEvent: boolean) => {
		event.stopPropagation();
		const value = (event.target as HTMLInputElement).value;
		const returnValues: RangeValue = isMinEvent
			? { min: Math.min(parseFloat(value), max), max }
			: { min, max: Math.max(min, parseFloat(value)) };

		icache.set('value', returnValues);
		onValue && onValue(returnValues);
	};

	const slider1 = (
		<input
			{...getInputProperties(true)}
			key="slider1"
			value={`${min}`}
			styles={{
				clip: `rect(auto, ${Math.round(slider1Size * size.client.width)}px, auto, auto)`
			}}
		/>
	);

	const slider2 = (
		<input
			{...getInputProperties(false)}
			key="slider2"
			styles={{
				clip: `rect(auto, auto, auto, ${Math.round(
					(1 - slider2Size) * size.client.width
				)}px)`
			}}
			value={`${max}`}
		/>
	);

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themeCss.root,
				disabled ? themeCss.disabled : null,
				isFocused ? themeCss.focused : null,
				valid === false ? themeCss.invalid : null,
				valid === true ? themeCss.valid : null,
				readOnly ? themeCss.readonly : null,
				showOutput ? themeCss.hasOutput : null
			]}
		>
			{label ? (
				<Label
					classes={classes}
					variant={variant}
					disabled={disabled}
					focused={isFocused}
					hidden={labelHidden}
					key="label"
					readOnly={readOnly}
					required={required}
					secondary={true}
					theme={themeProp}
					valid={valid}
					widgetId={`${widgetId}-label`}
				>
					{label}
				</Label>
			) : null}
			<div
				classes={[themeCss.inputWrapper, fixedCss.inputWrapperFixed]}
				onpointerenter={() => {
					onOver && onOver();
				}}
				onpointerleave={() => {
					onOut && onOut();
				}}
			>
				{slider1}
				<div classes={baseCss.visuallyHidden} id={minLabelId} key="minimumLabel">
					{minimumLabel}
				</div>
				{slider2}
				<div classes={baseCss.visuallyHidden} id={maxLabelId} key="maximumLabel">
					{maximumLabel}
				</div>
				<div
					classes={[themeCss.filled, fixedCss.filledFixed]}
					key="track"
					styles={{
						left: Math.round(slider1Percent * 100) + '%',
						width: Math.round((slider2Percent - slider1Percent) * 100) + '%'
					}}
				/>
				<div
					key="leftThumb"
					classes={[
						themeCss.thumb,
						themeCss.leftThumb,
						focus.isFocused('slider1') ? themeCss.focused : undefined,
						fixedCss.thumbFixed
					]}
					styles={{
						left: Math.round(slider1Percent * 100) + '%'
					}}
				/>
				<div
					key="rightThumb"
					classes={[
						themeCss.thumb,
						themeCss.rightThumb,
						focus.isFocused('slider2') ? themeCss.focused : undefined,
						fixedCss.thumbFixed
					]}
					styles={{
						left: Math.round(slider2Percent * 100) + '%'
					}}
				/>
				{showOutput ? (
					<output
						classes={[themeCss.output, outputIsTooltip ? themeCss.outputTooltip : null]}
						for={widgetId}
						styles={
							outputIsTooltip
								? {
										left: `${Math.round(
											(slider1Percent +
												(slider2Percent - slider1Percent) / 2) *
												100
										)}%`
								  }
								: undefined
						}
						tabIndex={-1}
					>
						{output ? output({ min, max }) : `${min}, ${max}`}
					</output>
				) : null}
			</div>
		</div>
	);
});

export default RangeSlider;
