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
			label: 'Fourth Option'
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
			label: 'Goat'
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
				innerHTML: 'Result: ' + this.state['value1']
			}),
			v('h2', {}, [ 'Custom Select Box, single select:' ]),
			w(Select, {
				key: 'select2',
				overrideClasses: exampleCss,
				label: 'Custom box!',
				options: this._selectOptions,
				value: <string> this.state['value2'],
				renderOption: (option: SelectOption) => {
					return v('div', {
						classes: this.classes(exampleCss.option),
						innerHTML: option.label
					});
				},
				onChange: (option: SelectOption) => {
					this.setState({ value2: option.value });
				}
			}),
			v('h2', {}, [ 'Native multiselect widget' ]),
			w(Select, {
				key: 'select3',
				options: this._selectOptions,
				useNativeSelect: true,
				multiple: true,
				onChange: (option: SelectOption) => {
					console.log('changed option', option);
					// this.setState({ value: value });
				}
			}),
			v('h2', {}, [ 'Custom select widget, multiple selection' ]),
			w(Select, {
				key: 'select4',
				overrideClasses: exampleCss,
				options: this._moreSelectOptions,
				multiple: true,
				renderOption: (option: SelectOption) => {
					return v('div', {
						classes: this.classes(exampleCss.option),
						innerHTML: option.label
					});
				},
				onChange: (option: SelectOption) => {
					console.log('changed option', option);
					// this.setState({ value: value });
				}
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
