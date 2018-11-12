import { uuid } from '@dojo/framework/core/util';
import { v, w } from '@dojo/framework/widget-core/d';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import Dimensions from '@dojo/framework/widget-core/meta/Dimensions';
import Focus from '@dojo/framework/widget-core/meta/Focus';
import { theme, ThemedMixin, ThemedProperties } from '@dojo/framework/widget-core/mixins/Themed';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import {
	CustomAriaProperties,
	InputProperties,
	KeyEventProperties,
	LabeledProperties,
	PointerEventProperties
} from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import Label from '../label/index';
import * as fixedCss from './styles/range-slider.m.css';
import * as css from '../theme/range-slider.m.css';
import * as baseCss from '../common/styles/base.m.css';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';

export interface RangeSliderProperties extends ThemedProperties, LabeledProperties, InputProperties, PointerEventProperties, KeyEventProperties, CustomAriaProperties {
	max?: number;
	min?: number;
	output?(min: number, max: number): DNode;
	outputIsTooltip?: boolean;
	showOutput?: boolean;
	step?: number;
	minValue?: number;
	maxValue?: number;
	minName?: string;
	maxName?: string;
	minimumLabel?: string;
	maximumLabel?: string;
	onClick?(minValue: number, maxValue: number): void;
	onInput?(minValue: number, maxValue: number): void;
	onChange?(minValue: number, maxValue: number): void;
	onBlur?(value?: string | number | boolean): void;
	onFocus?(value?: string | number | boolean): void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

function extractValue(event: Event): number {
	const value = (event.target as HTMLInputElement).value;
	return parseFloat(value);
}

type MinMaxCallback = (minValue: number, maxValue: number) => void;

@theme(css)
@customElement<RangeSliderProperties>({
	tag: 'dojo-range-slider',
	properties: [
		'theme',
		'aria',
		'extraClasses',
		'disabled',
		'invalid',
		'required',
		'readOnly',
		'labelAfter',
		'labelHidden',
		'max',
		'min',
		'output',
		'outputIsTooltip',
		'showOutput',
		'step',
		'minValue',
		'maxValue',
		'minName',
		'maxName',
		'minimumLabel',
		'maximumLabel'
	],
	attributes: ['widgetId', 'label', 'name'],
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
export class RangeSliderBase<P extends RangeSliderProperties = RangeSliderProperties> extends ThemedBase<P, null> {
	// id used to associate input with output
	private _widgetId = uuid();
	private _minLabelId = uuid();
	private _maxLabelId = uuid();

	protected getRootClasses(): (string | null)[] {
		const {
			disabled,
			invalid,
			readOnly,
			required,
			showOutput
		} = this.properties;
		const focus = this.meta(Focus).get('root');

		return [
			css.root,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			invalid === true ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null,
			showOutput ? css.hasOutput : null
		];
	}

	private _genericCallback(callback?: MinMaxCallback, minEvent?: Event, maxEvent?: Event) {
		minEvent && minEvent.stopPropagation();
		maxEvent && maxEvent.stopPropagation();

		const { min = 0, max = 100 } = this.properties;
		const { minValue = min, maxValue = max } = this.properties;

		callback && callback(
			minEvent ? extractValue(minEvent) : minValue,
			maxEvent ? extractValue(maxEvent) : maxValue
		);
	}

	private _genericChangeCallback(callback?: MinMaxCallback, minEvent?: Event, maxEvent?: Event) {
		minEvent && minEvent.stopPropagation();
		maxEvent && maxEvent.stopPropagation();

		const { min = 0, max = 100 } = this.properties;
		const { minValue = min, maxValue = max } = this.properties;

		if (minEvent) {
			callback && callback(Math.min(extractValue(minEvent), maxValue), maxValue);
		}
		else if (maxEvent) {
			callback && callback(minValue, Math.max(minValue, extractValue(maxEvent)));
		}
	}

	private _onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyDown && this.properties.onKeyDown(event.which, () => { event.preventDefault(); });
	}

	private _onKeyPress(event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyPress && this.properties.onKeyPress(event.which, () => { event.preventDefault(); });
	}

	private _onKeyUp(event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyUp && this.properties.onKeyUp(event.which, () => { event.preventDefault(); });
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

	private _getInputProperties(isSlider1: boolean) {
		const {
			aria = {},
			disabled,
			invalid,
			max = 100,
			min = 0,
			name = '',
			readOnly,
			required,
			step = 1
		} = this.properties;
		const {
			minName = `${name}_min`,
			maxName = `${name}_max`
		} = this.properties;

		const prepareCallback = (callback: (callback?: MinMaxCallback, minEvent?: Event, maxEvent?: Event) => void, property?: MinMaxCallback) => {
			return (e?: Event) => {
				callback(property, ...[isSlider1 ? e : undefined, !isSlider1 ? e : undefined]);
			};
		};

		return {
			...formatAriaProperties(aria),
			'aria-invalid': invalid === true ? 'true' : null,
			'aria-readonly': readOnly === true ? 'true' : null,
			'aria-describedby': isSlider1 ? this._minLabelId : this._maxLabelId,
			type: 'range',
			min: `${min}`,
			max: `${max}`,
			step: `${step}`,
			readonly: readOnly,
			required,
			disabled,
			name: isSlider1 ? minName : maxName,
			onblur: prepareCallback((prop, e1, e2) => this._genericCallback(prop, e1, e2), this.properties.onBlur),
			onclick: prepareCallback((prop, e1, e2) => this._genericCallback(prop, e1, e2), this.properties.onClick),
			onfocus: prepareCallback((prop, e1, e2) => this._genericCallback(prop, e1, e2), this.properties.onFocus),
			onchange: prepareCallback((prop, e1, e2) => this._genericChangeCallback(prop, e1, e2), this.properties.onChange),
			oninput: prepareCallback((prop, e1, e2) => this._genericChangeCallback(prop, e1, e2), this.properties.onInput),
			onkeydown: this._onKeyDown,
			onkeypress: this._onKeyPress,
			onkeyup: this._onKeyUp,
			onmousedown: this._onMouseDown,
			onmouseup: this._onMouseUp,
			ontouchstart: this._onTouchStart,
			ontouchend: this._onTouchEnd,
			ontouchcancel: this._onTouchCancel,
			classes: [this.theme(css.input), fixedCss.nativeInput]
		};
	}

	protected renderOutput(minValue: number, maxValue: number, percentValue: number[]): DNode {
		const {
			output,
			outputIsTooltip = false
		} = this.properties;

		const outputNode = output ? output(minValue, maxValue) : `${minValue}, ${maxValue}`;

		// output styles
		let outputStyles: { left?: string; top?: string } = {};
		if (outputIsTooltip) {
			outputStyles = { left: `${Math.round((percentValue[0] + (percentValue[1] - percentValue[0]) / 2) * 100)}%` };
		}

		return v('output', {
			classes: this.theme([css.output, outputIsTooltip ? css.outputTooltip : null]),
			for: this._widgetId,
			styles: outputStyles,
			tabIndex: -1 /* needed so Edge doesn't select the element while tabbing through */
		}, [outputNode]);
	}

	render(): DNode {
		const {
			disabled,
			widgetId = this._widgetId,
			invalid,
			label,
			labelAfter,
			labelHidden,
			max = 100,
			min = 0,
			readOnly,
			required,
			theme,
			showOutput = false,
			minimumLabel = 'Minimum',
			maximumLabel = 'Maximum'
		} = this.properties;
		const focus = this.meta(Focus).get('root');
		let { minValue = min, maxValue = max } = this.properties;

		minValue = Math.max(minValue, min);
		maxValue = Math.min(maxValue, max);

		const slider1Percent = (minValue - min) / (max - min);
		const slider2Percent = (maxValue - min) / (max - min);

		const slider1Size = slider1Percent + (slider2Percent - slider1Percent) / 2;
		const slider2Size = 1 - slider1Size;

		const size = this.meta(Dimensions).get('root');

		const slider1Focus = this.meta(Focus).get('slider1');
		const slider2Focus = this.meta(Focus).get('slider2');

		const slider1 = v('input', {
			...this._getInputProperties(true),
			key: 'slider1',
			value: `${minValue}`,
			styles: {
				clip: `rect(auto, ${Math.round((slider1Size) * size.client.width)}px, auto, auto)`
			}
		});
		const slider2 = v('input', {
			...this._getInputProperties(false),
			key: 'slider2',
			value: `${maxValue}`,
			styles: {
				clip: `rect(auto, auto, auto, ${Math.round((1 - slider2Size) * size.client.width)}px)`
			}
		});

		const children = [
			label ? w(Label, {
				key: 'label',
				theme,
				disabled,
				focused: focus.containsFocus,
				invalid,
				readOnly,
				required,
				hidden: labelHidden,
				forId: widgetId
			}, [label]) : null,
			v('div', {
				classes: [this.theme(css.inputWrapper), fixedCss.inputWrapperFixed]
			}, [
				slider1,
				v('div', {
					key: 'minimumLabel',
					classes: [baseCss.visuallyHidden],
					id: this._minLabelId
				}, [minimumLabel]),
				slider2,
				v('div', {
					key: 'maximumLabel',
					classes: [baseCss.visuallyHidden],
					id: this._maxLabelId
				}, [maximumLabel]),
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
					classes: [...this.theme([
						css.thumb,
						css.leftThumb,
						slider1Focus.active ? css.focused : undefined
					]), fixedCss.thumbFixed],
					styles: {
						left: Math.round(slider1Percent * 100) + '%'
					}
				}),
				v('div', {
					key: 'rightThumb',
					classes: [...this.theme([
						css.thumb,
						css.rightThumb,
						slider2Focus.active ? css.focused : undefined
					]), fixedCss.thumbFixed],
					styles: {
						left: Math.round(slider2Percent * 100) + '%'
					}
				}),
				showOutput ? this.renderOutput(minValue, maxValue, [slider1Percent, slider2Percent]) : null
			])
		];

		return v('div', {
			key: 'root',
			id: this._widgetId,
			classes: this.theme(this.getRootClasses())
		}, labelAfter ? children.reverse() : children);
	}
}

export default class RangeSlider extends RangeSliderBase<RangeSliderProperties> {}
