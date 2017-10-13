import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Select, { SelectProperties } from '../Select';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _value1: string;
	private _value2: string;

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

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

	getOptionSettings(): Partial<SelectProperties> {
		return {
			getOptionDisabled: (option) => option.disabled,
			getOptionLabel: (option) => option.label,
			getOptionValue: (option) => option.value
		};
	}

	render() {

		return v('div', [
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('br'),
			w(Select, {
				key: 'select1',
				...this.getOptionSettings(),
				getOptionSelected: (option: any) => !!this._value1 && option.value === this._value1,
				label: 'Native select',
				options: this._selectOptions,
				useNativeElement: true,
				value: this._value1,
				theme: this._theme,
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
				theme: this._theme,
				onChange: (option: any) => {
					this._value2 = option.value;
					this.invalidate();
				}
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
