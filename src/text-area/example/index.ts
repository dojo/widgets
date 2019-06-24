import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import Textarea from '../../text-area/index';

export default class App extends WidgetBase {
	private _value1: string | undefined;
	private _value2: string | undefined;
	private _invalid: boolean | undefined;

	render() {
		return v('div', [
			v('h2', {}, ['Textarea Example']),
			v('div', { id: 'example-t1' }, [
				w(Textarea, {
					key: 't1',
					columns: 40,
					rows: 8,
					placeholder: 'Hello, World',
					label: 'Type Something',
					value: this._value1,
					onInput: (value: string) => {
						this._value1 = value;
						this.invalidate();
					}
				})
			]),
			v('h3', {}, ['Disabled Textarea']),
			v('div', { id: 'example-t2' }, [
				w(Textarea, {
					key: 't2',
					columns: 40,
					rows: 3,
					label: "Can't type here",
					value: 'Initial value',
					disabled: true
				})
			]),
			v('h3', {}, ['Validated, Required Textarea']),
			v('div', { id: 'example-t3' }, [
				w(Textarea, {
					key: 't3',
					columns: 40,
					rows: 8,
					label: 'Required',
					required: true,
					value: this._value2,
					invalid: this._invalid,
					onChange: (value: string) => {
						this._value2 = value;
						this._invalid = value.trim().length === 0;
						this.invalidate();
					}
				})
			]),
			v('h3', {}, ['Hidden Label Textarea']),
			v('div', { id: 'example-t4' }, [
				w(Textarea, {
					key: 't4',
					columns: 40,
					rows: 8,
					label: 'Hidden label',
					labelHidden: true
				})
			]),
			v('h3', {}, ['Helper Text Textarea']),
			v('div', { id: 'example-helperText' }, [
				w(Textarea, {
					key: 't4',
					columns: 40,
					rows: 8,
					label: 'has helper text',
					helperText: 'Hi there, enter some text'
				})
			])
		]);
	}
}
