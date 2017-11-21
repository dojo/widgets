import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import Label from '../label/Label';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import uuid from '@dojo/core/uuid';
import { LabeledProperties, InputEventProperties, MouseEventProperties, KeyEventProperties } from '../common/interfaces';
import * as css from './styles/slider.m.css';

/**
 * @type SliderProperties
 *
 * Properties that can be set on a Slider component
 *
 * @property describedBy       ID of an element that provides more descriptive text
 * @property disabled          Prevents the user from interacting with the form field
 * @property invalid           Indicates the valid is invalid, or required and not filled in
 * @property label             Label settings for form label text, position, and visibility
 * @property max               The maximum value for the slider
 * @property min               The minimum value for the slider
 * @property name              The form widget's name
 * @property output            An optional function that returns a string or DNode for custom output format
 * @property readOnly          Allows or prevents user interaction
 * @property required          Whether or not a value is required
 * @property step              Size of the slider increment
 * @property value             The current value
 * @property vertical          Orients the slider vertically, false by default.
 * @property verticalHeight    Length of the vertical slider (only used if vertical is true)
 */
export interface SliderProperties extends ThemedProperties, LabeledProperties, InputEventProperties, MouseEventProperties, KeyEventProperties {
	describedBy?: string;
	disabled?: boolean;
	invalid?: boolean;
	max?: number;
	min?: number;
	name?: string;
	output?(value: number): DNode;
	outputIsTooltip?: boolean;
	readOnly?: boolean;
	required?: boolean;
	step?: number;
	value?: number;
	vertical?: boolean;
	verticalHeight?: string;
}

export const SliderBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Slider extends SliderBase<SliderProperties> {
	// id used to associate input with output
	private _inputId = uuid();

	private _onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	private _onChange (event: Event) { this.properties.onChange && this.properties.onChange(event); }
	private _onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	private _onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	private _onInput (event: Event) { this.properties.onInput && this.properties.onInput(event); }
	private _onKeyDown (event: KeyboardEvent) { this.properties.onKeyDown && this.properties.onKeyDown(event); }
	private _onKeyPress (event: KeyboardEvent) { this.properties.onKeyPress && this.properties.onKeyPress(event); }
	private _onKeyUp (event: KeyboardEvent) { this.properties.onKeyUp && this.properties.onKeyUp(event); }
	private _onMouseDown (event: MouseEvent) { this.properties.onMouseDown && this.properties.onMouseDown(event); }
	private _onMouseUp (event: MouseEvent) { this.properties.onMouseUp && this.properties.onMouseUp(event); }
	private _onTouchStart (event: TouchEvent) { this.properties.onTouchStart && this.properties.onTouchStart(event); }
	private _onTouchEnd (event: TouchEvent) { this.properties.onTouchEnd && this.properties.onTouchEnd(event); }
	private _onTouchCancel (event: TouchEvent) { this.properties.onTouchCancel && this.properties.onTouchCancel(event); }

	protected getRootClasses(): (string | null)[] {
		const {
			disabled,
			invalid,
			readOnly,
			required,
			vertical = false
		} = this.properties;

		return [
			css.root,
			disabled ? css.disabled : null,
			invalid ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null,
			vertical ? css.vertical : null
		];
	}

	protected renderControls(percentValue: number): DNode {
		const {
			vertical = false,
			verticalHeight = '200px'
		} = this.properties;

		return v('div', {
			classes: [ this.theme(css.track), css.trackFixed ],
			'aria-hidden': 'true',
			styles: vertical ? { width: verticalHeight } : {}
		}, [
			v('span', {
				classes: [ this.theme(css.fill), css.fillFixed ],
				styles: { width: `${percentValue}%` }
			}),
			v('span', {
				classes: [ this.theme(css.thumb), css.thumbFixed ],
				styles: { left: `${percentValue}%` }
			})
		]);
	}

	protected renderOutput(value: number, percentValue: number): DNode {
		const {
			output,
			outputIsTooltip = false,
			vertical = false
		} = this.properties;

		const outputNode = output ? output(value) : `${value}`;

		// output styles
		let outputStyles: { left?: string; top?: string } = {};
		if (outputIsTooltip) {
			outputStyles = vertical ? { top: `${100 - percentValue}%` } : { left: `${percentValue}%` };
		}

		return v('output', {
			classes: [ this.theme(css.output), outputIsTooltip ? css.outputTooltip : null ],
			for: this._inputId,
			styles: outputStyles
		}, [ outputNode ]);
	}

	render(): DNode {
		const {
			describedBy,
			disabled,
			invalid,
			label,
			labelAfter,
			labelHidden,
			max = 100,
			min = 0,
			name,
			readOnly,
			required,
			step = 1,
			vertical = false,
			verticalHeight = '200px',
			theme
		} = this.properties;

		let {
			value = min
		} = this.properties;

		value = value > max ? max : value;
		value = value < min ? min : value;

		const percentValue = (value - min) / (max - min) * 100;

		const slider = v('div', {
			classes: [ this.theme(css.inputWrapper), css.inputWrapperFixed ],
			styles: vertical ? { height: verticalHeight } : {}
		}, [
			v('input', {
				key: 'input',
				classes: [ this.theme(css.input), css.nativeInput ],
				'aria-describedby': describedBy,
				disabled,
				id: this._inputId,
				'aria-invalid': invalid ? 'true' : null,
				max: `${max}`,
				min: `${min}`,
				name,
				readOnly,
				'aria-readonly': readOnly ? 'true' : null,
				required,
				step: `${step}`,
				styles: vertical ? { width: verticalHeight } : {},
				type: 'range',
				value: `${value}`,
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
			this.renderControls(percentValue),
			this.renderOutput(value, percentValue)
		]);

		const children = [
			label ? w(Label, { theme, disabled, invalid, readOnly, required, hidden: labelHidden, forId: this._inputId }, [ label ]) : null,
			slider
		];

		return v('div', {
			key: 'root',
			classes: [...this.theme(this.getRootClasses()), css.rootFixed]
		}, labelAfter ? children.reverse() : children);
	}
}
