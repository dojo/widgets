import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { tsx } from '@dojo/framework/core/vdom';
import Select, { SelectProperties } from '../index';

interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export default class App extends WidgetBase {
	private _value1: string | undefined;
	private _value2: string | undefined;
	private _value3: string | undefined;

	_selectOptions: SelectOption[] = [
		{
			value: 'cat',
			label: 'Cat'
		},
		{
			value: 'dog',
			label: 'Dog'
		},
		{
			value: 'hamster',
			label: 'Hamster'
		},
		{
			value: 'goat',
			label: 'Goat',
			disabled: true
		}
	];

	_moreSelectOptions: SelectOption[] = [
		{
			value: 'seattle',
			label: 'Seattle'
		},
		{
			value: 'san diego',
			label: 'San Diego'
		},
		{
			value: 'los-angeles',
			label: 'Los Angeles'
		},
		{
			value: 'austin',
			label: 'Austin'
		},
		{
			value: 'boston',
			label: 'Boston',
			disabled: true
		}
	];

	_evenMoreSelectOptions = ['Maru', 'Garfield', 'Grumpy Cat', 'Hobbes'];

	getOptionSettings(): Partial<SelectProperties<SelectOption>> {
		return {
			getOptionDisabled: (option) => Boolean(option.disabled),
			getOptionLabel: (option) => option.label,
			getOptionValue: (option) => option.value
		};
	}

	render() {
		return (
			<div>
				<Select
					key="select1"
					{...this.getOptionSettings()}
					getOptionSelected={(option) => !!this._value1 && option.value === this._value1}
					label="Native select"
					options={this._selectOptions}
					useNativeElement={true}
					value={this._value1}
					onChange={(option) => {
						this._value1 = option.value;
						this.invalidate();
					}}
				/>
				<p>{`Result value: ${this._value1}`}</p>
				<Select
					key="select2"
					{...this.getOptionSettings()}
					label="Custom select box"
					options={this._moreSelectOptions}
					value={this._value2}
					onChange={(option) => {
						this._value2 = option.value;
						this.invalidate();
					}}
				/>
				<br />
				<Select
					key="select3"
					getOptionSelected={(option) => !!this._value3 && option === this._value3}
					label="Custom select with placeholder"
					options={this._evenMoreSelectOptions}
					placeholder="Choose a cat"
					value={this._value3}
					onChange={(option) => {
						this._value3 = option;
						this.invalidate();
					}}
				/>
				<br />
				<Select
					key="select4"
					{...this.getOptionSettings()}
					getOptionSelected={(option) => !!this._value1 && option.value === this._value1}
					label="Native select with helper text"
					options={this._selectOptions}
					useNativeElement={true}
					value={this._value1}
					onChange={(option) => {
						this._value1 = option.value;
						this.invalidate();
					}}
					helperText="pick a value"
				/>
				<Select
					key="select5"
					{...this.getOptionSettings()}
					label="Custom select box with helper text"
					options={this._moreSelectOptions}
					value={this._value2}
					onChange={(option) => {
						this._value2 = option.value;
						this.invalidate();
					}}
					helperText="pick a value"
				/>
			</div>
		);
	}
}
