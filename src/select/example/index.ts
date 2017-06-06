import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Select from '../Select';
import SelectOption, { OptionData } from '../SelectOption';
import dojoTheme from '../../themes/dojo/theme';

class CustomOption extends SelectOption {
	renderLabel() {
		const { optionData } = this.properties;

		return v('div', {
			innerHTML: (optionData.selected ? 'x ' : '') + optionData.label,
			styles: { fontStyle: 'italic' }
		});
	}
}

export const AppBase = StatefulMixin(WidgetBase);

export class App extends AppBase<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	_selectOptions: OptionData[] = [
		{
			value: 'option1',
			label: 'First Option'
		},
		{
			value: 'option2',
			label: 'Second Option'
		},
		{
			value: 'option3',
			label: 'Third Option'
		},
		{
			value: 'option4',
			label: 'Fourth Option',
			disabled: true
		}
	];

	_moreSelectOptions: OptionData[] = [
		{
			value: 'cat',
			label: 'Cat',
			selected: true
		},
		{
			value: 'dog',
			label: 'Dog'
		},
		{
			value: 'hamster',
			label: 'Hamster',
			selected: true
		},
		{
			value: 'goat',
			label: 'Goat',
			disabled: true
		}
	];

	_evenMoreSelectOptions: OptionData[] = [
		{
			value: 'seattle',
			label: 'Seattle',
			selected: true
		},
		{
			value: 'los-angeles',
			label: 'Los Angeles'
		},
		{
			value: 'austin',
			label: 'Austin',
			selected: true
		},
		{
			value: 'boston',
			label: 'Boston'
		}
	];

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
				label: 'Try changing me',
				options: this._selectOptions,
				useNativeElement: true,
				value: this.state.value1,
				theme: this._theme,
				onChange: (option: OptionData) => {
					this.setState({ value1: option.value });
				}
			}),
			v('p', {
				innerHTML: 'Result value: ' + this.state.value1
			}),
			v('h2', {}, [ 'Custom Select Box, single select:' ]),
			w(Select, {
				key: 'select2',
				customOption: CustomOption,
				label: 'Custom box!',
				options: this._selectOptions,
				value: this.state.value2,
				theme: this._theme,
				onChange: (option: OptionData) => {
					this.setState({ value2: option.value });
				}
			}),
			v('h2', {}, [ 'Native multiselect widget' ]),
			w(Select, {
				key: 'select3',
				options: this._moreSelectOptions,
				useNativeElement: true,
				multiple: true,
				theme: this._theme,
				onChange: (option: OptionData) => {
					option.selected = !option.selected;
					this.invalidate();
				}
			}),
			v('h2', {}, [ 'Custom multiselect widget' ]),
			w(Select, {
				key: 'select4',
				customOption: CustomOption,
				options: this._evenMoreSelectOptions,
				multiple: true,
				theme: this._theme,
				onChange: (option: OptionData) => {
					option.selected = !option.selected;
					this.invalidate();
				}
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
