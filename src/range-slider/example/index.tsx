import { DNode } from '@dojo/framework/core/interfaces';
import { v, w } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import RangeSlider from '../index';

export default class App extends WidgetBase {
	private _state = {
		exampleMin: 25,
		exampleMax: 75,
		range1Min: 100,
		range1Max: 500,
		value1Min: 10,
		value1Max: 25,
		eventMin: 25,
		eventMax: 50,
		eventFocus: false,
		eventClick: 0,
		disabledMin: 25,
		disabledMax: 50,
		requiredMin: 25,
		requiredMax: 50
	};

	private _onRangeSliderInput({ min, max }: { min: number; max: number }) {
		this._state.exampleMin = min;
		this._state.exampleMax = max;
		this.invalidate();
	}

	private _onRange2SliderInput({ min, max }: { min: number; max: number }) {
		this._state.range1Min = min;
		this._state.range1Max = max;
		this.invalidate();
	}

	render(): DNode {
		return v('div', [
			v('h2', {}, ['Range Slider']),
			v('h3', {}, ['Value']),
			w(RangeSlider, {
				key: 'value1',
				label: 'mostly default settings',
				min: 0,
				max: 50,
				value: { min: this._state.value1Min, max: this._state.value1Max },
				onValue: ({ min, max }) => {
					this._state.value1Min = min;
					this._state.value1Max = max;
					this.invalidate();
				}
			}),
			v('div', {}, [`Min: ${this._state.value1Min} - Max: ${this._state.value1Max}`]),
			v('h3', {}, ['Tooltips']),
			v('h4', {}, ['showOutput']),
			v('div', { id: 'example-rs1' }, [
				w(RangeSlider, {
					key: 'example1',
					label: 'min = 0, max = 100, step = 1',
					min: 0,
					max: 100,
					value: { min: this._state.exampleMin, max: this._state.exampleMax },
					onValue: this._onRangeSliderInput,
					showOutput: true,
					output({ min, max }) {
						return `${min}, ${max}`;
					}
				})
			]),
			v('h4', {}, ['showOutput, outputIsTooltip']),
			w(RangeSlider, {
				key: 'example2',
				label: 'min = 100, max = 500, step = 20',
				min: 100,
				max: 500,
				step: 20,
				value: { min: this._state.range1Min, max: this._state.range1Max },
				onValue: this._onRange2SliderInput,
				showOutput: true,
				outputIsTooltip: true,
				output({ min, max }) {
					return `${min}, ${max}`;
				}
			}),
			v('h3', {}, ['Events']),
			w(RangeSlider, {
				key: 'eventExample',
				onValue: ({ min, max }) => {
					this._state.eventMin = min;
					this._state.eventMax = max;
					this.invalidate();
				},
				onFocus: () => {
					this._state.eventFocus = true;
					this.invalidate();
				},
				onBlur: () => {
					this._state.eventFocus = false;
					this.invalidate();
				},
				value: { min: this._state.eventMin, max: this._state.eventMax },
				label: 'event example'
			}),
			v('div', {}, [`Focused: ${this._state.eventFocus}, Clicks: ${this._state.eventClick}`]),
			v('h3', {}, ['Validation']),
			w(RangeSlider, {
				key: 'disabled',
				label: 'Disabled',
				disabled: true,
				value: { min: this._state.disabledMin, max: this._state.disabledMax },
				onValue: ({ min, max }) => {
					this._state.disabledMin = min;
					this._state.disabledMax = max;
					this.invalidate();
				}
			}),
			w(RangeSlider, {
				key: 'required',
				label: 'Required',
				value: { min: this._state.requiredMin, max: this._state.requiredMax },
				required: true,
				name: 'required',
				onValue: ({ min, max }) => {
					this._state.requiredMin = min;
					this._state.requiredMax = max;
					this.invalidate();
				}
			})
		]);
	}
}
