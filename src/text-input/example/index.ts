import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import TextInput from '../../text-input/index';

export default class App extends WidgetBase {
	private _value1: string | undefined;
	private _value2: string | undefined;
	private _value3: string | undefined;
	private _value5: string | undefined;
	private _value6: string | undefined;
	private _value6Valid!: boolean | { valid?: boolean; message?: string };

	render() {
		return v(
			'div',
			{
				styles: { maxWidth: '256px' }
			},
			[
				v('h2', {}, ['Text Input Examples']),
				v('div', { id: 'example-text' }, [
					v('h3', {}, ['String label']),
					w(TextInput, {
						key: 't1',
						label: 'Name',
						type: 'text',
						placeholder: 'Hello, World',
						value: this._value1,
						onChange: (value: string) => {
							this._value1 = value;
							this.invalidate();
						}
					})
				]),
				v('div', { id: 'example-email' }, [
					v('h3', {}, ['Label before the input']),
					w(TextInput, {
						key: 't2',
						type: 'email',
						label: 'Email (required)',
						required: true,
						value: this._value2,
						onChange: (value: string) => {
							this._value2 = value;
							this.invalidate();
						}
					})
				]),
				v('div', { id: 'example-hidden-label' }, [
					v('h3', {}, ['Hidden accessible label']),
					w(TextInput, {
						key: 't3',
						type: 'text',
						placeholder: 'Type something...',
						label: 'Try listening to me!',
						labelHidden: true,
						value: this._value3,
						onChange: (value: string) => {
							this._value3 = value;
							this.invalidate();
						}
					})
				]),
				v('div', { id: 'example-disabled' }, [
					v('h3', {}, ['Disabled text input']),
					w(TextInput, {
						key: 't4',
						type: 'text',
						label: "Can't type here",
						value: 'Initial value',
						disabled: true,
						readOnly: true
					})
				]),
				v('div', { id: 'helper-text' }, [
					v('h3', {}, ['Helper Text']),
					w(TextInput, {
						key: 't5',
						type: 'text',
						label: 'input with helper text',
						value: this._value5,
						helperText: 'helper text',
						onInput: (value: string) => {
							this._value5 = value;
							this.invalidate();
						}
					})
				]),
				v('div', { id: 'example-validated' }, [
					v('h3', {}, ['Validated Input']),
					w(TextInput, {
						key: 't5',
						type: 'text',
						label: 'Type "foo" or "bar"',
						value: this._value6,
						valid: this._value6Valid,
						required: true,
						helperText: 'helper text',
						onValidate: (valid?: boolean, message?: string) => {
							this._value6Valid = { valid, message };
							this.invalidate();
						},
						pattern: 'foo|bar',
						onInput: (value: string) => {
							this._value6 = value;
							this.invalidate();
						}
					})
				]),
				v('div', { id: 'example-leading-trailing' }, [
					v('h3', {}, ['leading / trailing icon text input']),
					w(TextInput, {
						key: 't4',
						type: 'text',
						label: "Can't type here",
						value: 'Initial value',
						leading: () => v('span', {}, ['A']),
						trailing: () => v('span', {}, ['Z'])
					})
				])
			]
		);
	}
}
