import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import TextArea from '../../text-area/index';

export default class App extends WidgetBase {
	private _value1: string | undefined;
	private _value2: string | undefined;
	private _valid1: undefined | boolean | { valid?: boolean; message?: string };
	private _customValid: undefined | boolean | { valid?: boolean; message?: string };
	private _customValue: string | undefined;

	render() {
		return v('div', [
			v('h2', {}, ['Textarea Example']),
			v('div', { id: 'example-t1' }, [
				w(TextArea, {
					key: 't1',
					columns: 40,
					rows: 8,
					placeholder: 'Hello, World',
					label: 'Type Something',
					value: this._value1,
					onValue: (value: string) => {
						this._value1 = value;
						this.invalidate();
					}
				})
			]),
			v('h3', {}, ['Disabled Textarea']),
			v('div', { id: 'example-t2' }, [
				w(TextArea, {
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
				w(TextArea, {
					key: 't3',
					columns: 40,
					rows: 8,
					label: 'Required',
					required: true,
					value: this._value2,
					valid: this._valid1,
					onValidate: (valid?: boolean, message?: string) => {
						this._valid1 = { valid, message };
						this.invalidate();
					},
					onValue: (value: string) => {
						this._value2 = value;
						this.invalidate();
					}
				})
			]),
			v('h3', {}, ['Custom validated Textarea']),
			v('div', { id: 'example-custom-validated' }, [
				w(TextArea, {
					key: 'custom-validated',
					columns: 40,
					rows: 8,
					label: 'Custom Validated',
					value: this._customValue,
					valid: this._customValid,
					customValidator: (value: string) => {
						if (value === 'valid') {
							return {
								valid: true,
								message: 'Value is valid!'
							};
						} else if (!value) {
							return undefined;
						} else {
							return {
								valid: false,
								message: 'Only "valid" is a valid input'
							};
						}
					},
					helperText: 'Enter "valid" to be valid',
					onValidate: (valid?: boolean, message?: string) => {
						this._customValid = { valid, message };
						this.invalidate();
					},
					onValue: (value: string) => {
						this._customValue = value;
						this.invalidate();
					}
				})
			]),
			v('h3', {}, ['Hidden Label Textarea']),
			v('div', { id: 'example-t4' }, [
				w(TextArea, {
					key: 't4',
					columns: 40,
					rows: 8,
					label: 'Hidden label',
					labelHidden: true
				})
			]),
			v('h3', {}, ['Helper Text Textarea']),
			v('div', { id: 'example-helperText' }, [
				w(TextArea, {
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
