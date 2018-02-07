import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import Label from '../label/Label';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import uuid from '@dojo/core/uuid';
import { CustomAriaProperties, LabeledProperties, InputEventProperties, InputProperties, PointerEventProperties, KeyEventProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import * as fixedCss from './styles/slider.m.css';
import * as css from '../theme/slider/slider.m.css';
import { customElement } from '@dojo/widget-core/decorators/customElement';

/**
 * @type SliderProperties
 *
 * Properties that can be set on a Slider component
 *
 * @property max               The maximum value for the slider
 * @property min               The minimum value for the slider
 * @property output            An optional function that returns a string or DNode for custom output format
 * @property step              Size of the slider increment
 * @property vertical          Orients the slider vertically, false by default.
 * @property verticalHeight    Length of the vertical slider (only used if vertical is true)
 * @property value           The current value
 */
export interface SliderProperties extends ThemedProperties, LabeledProperties, InputProperties, InputEventProperties, PointerEventProperties, KeyEventProperties, CustomAriaProperties {
	max?: number;
	min?: number;
	output?(value: number): DNode;
	outputIsTooltip?: boolean;
	step?: number;
	vertical?: boolean;
	verticalHeight?: string;
	value?: number;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<SliderProperties>({
	tag: 'dojo-slider',
	properties: [
		'theme',
		'aria',
		'extraClasses',
		'disabled',
		'invalid',
		'required',
		'readOnly',
		'max',
		'min',
		'outputIsTooltip',
		'step',
		'vertical',
		'value'
	],
	attributes: [ 'verticalHeight' ],
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
		'onTouchStart'
	]
})
export class SliderBase<P extends SliderProperties = SliderProperties> extends ThemedBase<P, null> {
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
			invalid === true ? css.invalid : null,
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
			classes: [ this.theme(css.track), fixedCss.trackFixed ],
			'aria-hidden': 'true',
			styles: vertical ? { width: verticalHeight } : {}
		}, [
			v('span', {
				classes: [ this.theme(css.fill), fixedCss.fillFixed ],
				styles: { width: `${percentValue}%` }
			}),
			v('span', {
				classes: [ this.theme(css.thumb), fixedCss.thumbFixed ],
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
			classes: [ this.theme(css.output), outputIsTooltip ? fixedCss.outputTooltip : null ],
			for: this._inputId,
			styles: outputStyles
		}, [ outputNode ]);
	}

	render(): DNode {
		const {
			aria = {},
			disabled,
			id = this._inputId,
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
			classes: [ this.theme(css.inputWrapper), fixedCss.inputWrapperFixed ],
			styles: vertical ? { height: verticalHeight } : {}
		}, [
			v('input', {
				key: 'input',
				...formatAriaProperties(aria),
				classes: [ this.theme(css.input), fixedCss.nativeInput ],
				disabled,
				id,
				'aria-invalid': invalid === true ? 'true' : null,
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
			label ? w(Label, {
				theme,
				disabled,
				invalid,
				readOnly,
				required,
				hidden: labelHidden,
				forId: id
			}, [ label ]) : null,
			slider
		];

		return v('div', {
			key: 'root',
			classes: [...this.theme(this.getRootClasses()), fixedCss.rootFixed]
		}, labelAfter ? children.reverse() : children);
	}
}

export default class Slider extends SliderBase<SliderProperties> {}
