import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Select, { SelectOption } from '../../select/Select';
import * as exampleCss from '../styles/example.m.css';

export const AppBase = StatefulMixin(ThemeableMixin(WidgetBase));

@theme(exampleCss)
export class App extends AppBase<WidgetProperties> {
	_selectOptions: SelectOption[] = [
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

	_moreSelectOptions: SelectOption[] = [
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

	_evenMoreSelectOptions: SelectOption[] = [
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
			w(Select, {
				key: 'select1',
				label: 'Try changing me',
				options: this._selectOptions,
				useNativeSelect: true,
				value: <string> this.state['value1'],
				onChange: (option: SelectOption) => {
					this.setState({ value1: option.value });
				}
			}),
			v('p', {
				innerHTML: 'Result value: ' + this.state['value1']
			}),
			v('h2', {}, [ 'Custom Select Box, single select:' ]),
			w(Select, {
				key: 'select2',
				label: 'Custom box!',
				options: this._selectOptions,
				value: <string> this.state['value2'],
				renderOption: (option: SelectOption) => {
					return v('div', {
						innerHTML: (option.selected ? 'x ' : '') + option.label,
						styles: { fontStyle: 'italic' }
					});
				},
				onChange: (option: SelectOption) => {
					this.setState({ value2: option.value });
				}
			}),
			v('h2', {}, [ 'Native multiselect widget' ]),
			w(Select, {
				key: 'select3',
				options: this._moreSelectOptions,
				useNativeSelect: true,
				multiple: true,
				onChange: (option: SelectOption) => {
					option.selected = !option.selected;
				}
			}),
			v('h2', {}, [ 'Custom multiselect widget' ]),
			w(Select, {
				key: 'select4',
				options: this._evenMoreSelectOptions,
				multiple: true,
				renderOption: (option: SelectOption) => {
					return v('div', {
						innerHTML: (option.selected ? 'x ' : '') + option.label,
						styles: { fontStyle: 'italic' }
					});
				},
				onChange: (option: SelectOption) => {
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
