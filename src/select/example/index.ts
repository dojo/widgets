import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import Select, { SelectProperties } from '../../select/index';

export default class App extends WidgetBase {
	private _value1: string | undefined;
	private _value2: string | undefined;
	private _value3: string | undefined;

	_selectOptions = [
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

	_moreSelectOptions = [
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

	getOptionSettings(): Partial<SelectProperties> {
		return {
			getOptionDisabled: (option) => option.disabled,
			getOptionLabel: (option) => option.label,
			getOptionValue: (option) => option.value
		};
	}

	render() {
		return v('div', [
			w(Select, {
				key: 'select1',
				...this.getOptionSettings(),
				getOptionSelected: (option: any) => !!this._value1 && option.value === this._value1,
				label: 'Native select',
				options: this._selectOptions,
				useNativeElement: true,
				value: this._value1,
				onValue: (val: string) => {
					this._value1 = val;
					this.invalidate();
				}
			}),
			v('p', {
				innerHTML: 'Result value: ' + this._value1
			}),
			w(Select, {
				key: 'select2',
				...this.getOptionSettings(),
				label: 'Custom select box',
				options: this._moreSelectOptions,
				value: this._value2,
				onChange: (option: any) => {
					this._value2 = option.value;
					this.invalidate();
				}
			}),
			v('br'),
			w(Select, {
				key: 'select3',
				getOptionSelected: (option: any) => !!this._value3 && option === this._value3,
				label: 'Custom select with placeholder',
				options: this._evenMoreSelectOptions,
				placeholder: 'Choose a cat',
				value: this._value3,
				onValue: (val: string) => {
					this._value3 = val;
					this.invalidate();
				}
			}),
			v('br'),
			w(Select, {
				key: 'select4',
				...this.getOptionSettings(),
				getOptionSelected: (option: any) => !!this._value1 && option.value === this._value1,
				label: 'Native select with helper text',
				options: this._selectOptions,
				useNativeElement: true,
				value: this._value1,
				onValue: (val: string) => {
					this._value1 = val;
					this.invalidate();
				},
				helperText: 'pick a value'
			}),
			w(Select, {
				key: 'select5',
				...this.getOptionSettings(),
				label: 'Custom select box with helper text',
				options: this._moreSelectOptions,
				value: this._value2,
				onValue: (val: string) => {
					this._value2 = val;
					this.invalidate();
				},
				helperText: 'pick a value'
			})
		]);
	}
}
