import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Label from '../label/index';
import { v, w } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import Focus from '@dojo/framework/core/meta/Focus';
import { uuid } from '@dojo/framework/core/util';
import { formatAriaProperties } from '../common/util';
import * as fixedCss from './styles/slider.m.css';
import * as css from '../theme/slider.m.css';

/**
 * @type SliderProperties
 *
 * Properties that can be set on a Slider component
 *
 * @property aria
 * @property disabled
 * @property label
 * @property labelAfter
 * @property labelHidden
 * @property max               The maximum value for the slider
 * @property min               The minimum value for the slider
 * @property name
 * @property onBlur
 * @property onClick
 * @property onFocus
 * @property onValue
 * @property output            An optional function that returns a string or DNode for custom output format
 * @property outputIsTooltip
 * @property readOnly
 * @property required
 * @property showOutput        Toggles visibility of slider output
 * @property step              Size of the slider increment
 * @property valid
 * @property value           The current value
 * @property vertical          Orients the slider vertically, false by default.
 * @property verticalHeight    Length of the vertical slider (only used if vertical is true)
 * @property id
 */
export interface SliderProperties extends ThemedProperties, FocusProperties {
	aria?: { [key: string]: string | null };
	disabled?: boolean;
	label?: string;
	labelAfter?: boolean;
	labelHidden?: boolean;
	max?: number;
	min?: number;
	name?: string;
	onBlur?(): void;
	onClick?(value: number): void;
	onFocus?(): void;
	onValue?(value?: number): void;
	output?(value: number): DNode;
	outputIsTooltip?: boolean;
	readOnly?: boolean;
	required?: boolean;
	showOutput?: boolean;
	step?: number;
	valid?: boolean;
	value?: number;
	vertical?: boolean;
	verticalHeight?: string;
	id?: string;
}

@theme(css)
export class Slider extends ThemedMixin(FocusMixin(WidgetBase))<SliderProperties> {
	// id used to associate input with output
	private _id = uuid();

	private _onBlur() {
		this.properties.onBlur && this.properties.onBlur();
	}
	private _onFocus() {
		this.properties.onFocus && this.properties.onFocus();
	}
	private _onInput(event: Event) {
		event.stopPropagation();
		const value = (event.target as HTMLInputElement).value;

		this.properties.onValue && this.properties.onValue(parseFloat(value));
	}

	protected getRootClasses(): (string | null)[] {
		const { disabled, valid, readOnly, required, vertical = false } = this.properties;
		const focus = this.meta(Focus).get('root');

		return [
			css.root,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			valid === false ? css.invalid : null,
			valid === true ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null,
			vertical ? css.vertical : null
		];
	}

	protected renderControls(percentValue: number): DNode {
		const { vertical = false, verticalHeight = '200px' } = this.properties;

		return v(
			'div',
			{
				classes: [this.theme(css.track), fixedCss.trackFixed],
				'aria-hidden': 'true',
				styles: vertical ? { width: verticalHeight } : {}
			},
			[
				v('span', {
					classes: [this.theme(css.fill), fixedCss.fillFixed],
					styles: { width: `${percentValue}%` }
				}),
				v('span', {
					classes: [this.theme(css.thumb), fixedCss.thumbFixed],
					styles: { left: `${percentValue}%` }
				})
			]
		);
	}

	protected renderOutput(value: number, percentValue: number): DNode {
		const { output, outputIsTooltip = false, vertical = false } = this.properties;

		const outputNode = output ? output(value) : `${value}`;

		// output styles
		let outputStyles: { left?: string; top?: string } = {};
		if (outputIsTooltip) {
			outputStyles = vertical
				? { top: `${100 - percentValue}%` }
				: { left: `${percentValue}%` };
		}

		return v(
			'output',
			{
				classes: this.theme([css.output, outputIsTooltip ? css.outputTooltip : null]),
				for: this._id,
				styles: outputStyles,
				tabIndex: -1 /* needed so Edge doesn't select the element while tabbing through */
			},
			[outputNode]
		);
	}

	render(): DNode {
		const {
			aria = {},
			disabled,
			id = this._id,
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
			theme,
			classes
		} = this.properties;
		const focus = this.meta(Focus).get('root');

		let { value = min } = this.properties;

		value = value > max ? max : value;
		value = value < min ? min : value;

		const percentValue = ((value - min) / (max - min)) * 100;

		const slider = v(
			'div',
			{
				classes: [this.theme(css.inputWrapper), fixedCss.inputWrapperFixed],
				styles: vertical ? { height: verticalHeight } : {}
			},
			[
				v('input', {
					key: 'input',
					...formatAriaProperties(aria),
					classes: [this.theme(css.input), fixedCss.nativeInput],
					disabled,
					id,
					focus: this.shouldFocus,
					'aria-invalid': valid === false ? 'true' : null,
					max: `${max}`,
					min: `${min}`,
					name,
					readOnly,
					'aria-readonly': readOnly === true ? 'true' : null,
					required,
					step: `${step}`,
					styles: vertical ? { width: verticalHeight } : {},
					type: 'range',
					value: `${value}`,
					onblur: this._onBlur,
					onfocus: this._onFocus,
					oninput: this._onInput
				}),
				this.renderControls(percentValue),
				showOutput ? this.renderOutput(value, percentValue) : null
			]
		);

		const children = [
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
							forId: id
						},
						[label]
				  )
				: null,
			slider
		];

		return v(
			'div',
			{
				key: 'root',
				classes: [...this.theme(this.getRootClasses()), fixedCss.rootFixed]
			},
			labelAfter ? children.reverse() : children
		);
	}
}

export default Slider;
