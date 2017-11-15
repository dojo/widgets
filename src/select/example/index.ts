import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedProperties } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import Select, { SelectProperties } from '../Select';

export default class App extends WidgetBase<ThemedProperties> {
	private _value1: string;
	private _value2: string;
	private _value3: string;

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
			value: 'los-angeles',
			label: 'Los Angeles'
		},
		{
			value: 'austin',
			label: 'Austin'
		},
		{
			value: 'boston',
			label: 'Boston'
		}
	];

	_evenMoreSelectOptions = [ 'Maru', 'Garfield', 'Grumpy Cat', 'Hobbes' ];

	getOptionSettings(): Partial<SelectProperties> {
		return {
			getOptionDisabled: (option) => option.disabled,
			getOptionLabel: (option) => option.label,
			getOptionValue: (option) => option.value
		};
	}

	render() {
		const { theme } = this.properties;

		return v('div', [
			v('br'),
			w(Select, {
				key: 'select1',
				...this.getOptionSettings(),
				getOptionSelected: (option: any) => !!this._value1 && option.value === this._value1,
				label: 'Native select',
				options: this._selectOptions,
				useNativeElement: true,
				value: this._value1,
				theme,
				onChange: (option: any) => {
					this._value1 = option.value;
					this.invalidate();
				}
			}),
			v('p', {
				innerHTML: 'Result value: ' + this._value1
			}),
			w(Select, {
				key: 'select2',
				...this.getOptionSettings(),
				getOptionSelected: (option: any) => !!this._value2 && option.value === this._value2,
				label: 'Custom select box',
				options: this._moreSelectOptions,
				value: this._value2,
				theme,
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
				theme,
				onChange: (option: any) => {
					this._value3 = option;
					this.invalidate();
				}
			})
		]);
	}
}
