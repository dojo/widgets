import { uuid } from '@dojo/framework/core/util';
import { v, w } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import Dimensions from '@dojo/framework/core/meta/Dimensions';
import Focus from '../meta/Focus';
import { theme, ThemedMixin, ThemedProperties } from '@dojo/framework/core/mixins/Themed';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { formatAriaProperties } from '../common/util';
import Label from '../label/index';
import * as fixedCss from './styles/range-slider.m.css';
import * as css from '../theme/default/range-slider.m.css';
import * as baseCss from '../common/styles/base.m.css';

type RangeValue = { min: number; max: number };

export interface RangeSliderProperties extends ThemedProperties {
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
	/** A renderer used to display the output values (min, max) */
	output?(value: RangeValue): DNode;
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
	/** The current vlaue */
	value?: RangeValue;
	/** The id used for the form input element */
	widgetId?: string;
}

@theme(css)
export class RangeSlider extends ThemedMixin(WidgetBase)<RangeSliderProperties> {
	// id used to associate input with output
	private _widgetId = uuid();
	private _minLabelId = uuid();
	private _maxLabelId = uuid();

	protected getRootClasses(): (string | null)[] {
		const { disabled, valid, readOnly, showOutput } = this.properties;
		const focus = this.meta(Focus).get('root');

		return [
			this.variant(),
			css.root,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			valid === false ? css.invalid : null,
			valid === true ? css.valid : null,
			readOnly ? css.readonly : null,
			showOutput ? css.hasOutput : null
		];
	}

	private _onInput(event: Event, isMinEvent: boolean) {
		const { min: minRestraint = 0, max: maxRestraint = 100, onValue } = this.properties;
		const { value: { min, max } = { min: minRestraint, max: maxRestraint } } = this.properties;

		if (!onValue) {
			return;
		}

		event.stopPropagation();
		const value = (event.target as HTMLInputElement).value;
		const returnValues: RangeValue = isMinEvent
			? { min: Math.min(parseFloat(value), max), max }
			: { min, max: Math.max(min, parseFloat(value)) };

		onValue(returnValues);
	}

	private _getInputProperties(isSlider1: boolean) {
		const {
			aria = {},
			disabled,
			valid,
			max = 100,
			min = 0,
			name = '',
			readOnly,
			required,
			step = 1,
			widgetId = this._widgetId,
			onFocus,
			onBlur
		} = this.properties;
		const { minName = `${name}_min`, maxName = `${name}_max` } = this.properties;

		return {
			...formatAriaProperties(aria),
			'aria-invalid': valid === false ? 'true' : null,
			'aria-readonly': readOnly === true ? 'true' : null,
			'aria-describedby': isSlider1 ? this._minLabelId : this._maxLabelId,
			'aria-labelledby': `${widgetId}-label`,
			type: 'range',
			min: `${min}`,
			max: `${max}`,
			step: `${step}`,
			readonly: readOnly,
			required,
			disabled,
			name: isSlider1 ? minName : maxName,
			onblur: () => {
				onBlur && onBlur();
			},
			onfocus: () => {
				onFocus && onFocus();
			},
			oninput: (event: Event) => {
				this._onInput(event, isSlider1);
			},
			classes: [this.theme(css.input), fixedCss.nativeInput]
		};
	}

	protected renderOutput(value: RangeValue, percentValue: number[]): DNode {
		const { output, outputIsTooltip = false } = this.properties;

		const outputNode = output ? output(value) : `${value.min}, ${value.max}`;

		// output styles
		let outputStyles: { left?: string; top?: string } = {};
		if (outputIsTooltip) {
			outputStyles = {
				left: `${Math.round(
					(percentValue[0] + (percentValue[1] - percentValue[0]) / 2) * 100
				)}%`
			};
		}

		return v(
			'output',
			{
				classes: this.theme([css.output, outputIsTooltip ? css.outputTooltip : null]),
				for: this._widgetId,
				styles: outputStyles,
				tabIndex: -1 /* needed so Edge doesn't select the element while tabbing through */
			},
			[outputNode]
		);
	}

	render(): DNode {
		const {
			disabled,
			widgetId = this._widgetId,
			valid,
			label,
			labelAfter,
			labelHidden,
			max: maxRestraint = 100,
			min: minRestraint = 0,
			readOnly,
			required,
			theme,
			classes,
			showOutput = false,
			minimumLabel = 'Minimum',
			maximumLabel = 'Maximum',
			onOver,
			onOut
		} = this.properties;
		const focus = this.meta(Focus).get('root');
		let { value: { min, max } = { min: minRestraint, max: maxRestraint } } = this.properties;

		min = Math.max(min, minRestraint);
		max = Math.min(max, maxRestraint);

		const slider1Percent = (min - minRestraint) / (maxRestraint - minRestraint);
		const slider2Percent = (max - minRestraint) / (maxRestraint - minRestraint);

		const slider1Size = slider1Percent + (slider2Percent - slider1Percent) / 2;
		const slider2Size = 1 - slider1Size;

		const size = this.meta(Dimensions).get('root');

		const slider1Focus = this.meta(Focus).get('slider1');
		const slider2Focus = this.meta(Focus).get('slider2');

		const slider1 = v('input', {
			...this._getInputProperties(true),
			key: 'slider1',
			value: `${min}`,
			styles: {
				clip: `rect(auto, ${Math.round(slider1Size * size.client.width)}px, auto, auto)`
			}
		});
		const slider2 = v('input', {
			...this._getInputProperties(false),
			key: 'slider2',
			value: `${max}`,
			styles: {
				clip: `rect(auto, auto, auto, ${Math.round(
					(1 - slider2Size) * size.client.width
				)}px)`
			}
		});

		const children = [
			label
				? w(
						Label,
						{
							key: 'label',
							theme,
							classes,
							disabled,
							focused: focus.containsFocus,
							valid,
							readOnly,
							required,
							hidden: labelHidden,
							widgetId: `${widgetId}-label`
						},
						[label]
				  )
				: null,
			v(
				'div',
				{
					classes: [this.theme(css.inputWrapper), fixedCss.inputWrapperFixed],
					onpointerenter: () => {
						onOver && onOver();
					},
					onpointerleave: () => {
						onOut && onOut();
					}
				},
				[
					slider1,
					v(
						'div',
						{
							key: 'minimumLabel',
							classes: [baseCss.visuallyHidden],
							id: this._minLabelId
						},
						[minimumLabel]
					),
					slider2,
					v(
						'div',
						{
							key: 'maximumLabel',
							classes: [baseCss.visuallyHidden],
							id: this._maxLabelId
						},
						[maximumLabel]
					),
					v('div', {
						key: 'track',
						classes: [this.theme(css.filled), fixedCss.filledFixed],
						styles: {
							left: Math.round(slider1Percent * 100) + '%',
							width: Math.round((slider2Percent - slider1Percent) * 100) + '%'
						}
					}),
					v('div', {
						key: 'leftThumb',
						classes: [
							...this.theme([
								css.thumb,
								css.leftThumb,
								slider1Focus.active ? css.focused : undefined
							]),
							fixedCss.thumbFixed
						],
						styles: {
							left: Math.round(slider1Percent * 100) + '%'
						}
					}),
					v('div', {
						key: 'rightThumb',
						classes: [
							...this.theme([
								css.thumb,
								css.rightThumb,
								slider2Focus.active ? css.focused : undefined
							]),
							fixedCss.thumbFixed
						],
						styles: {
							left: Math.round(slider2Percent * 100) + '%'
						}
					}),
					showOutput
						? this.renderOutput({ min, max }, [slider1Percent, slider2Percent])
						: null
				]
			)
		];

		return v(
			'div',
			{
				key: 'root',
				classes: this.theme(this.getRootClasses())
			},
			labelAfter ? children.reverse() : children
		);
	}
}

export default RangeSlider;
