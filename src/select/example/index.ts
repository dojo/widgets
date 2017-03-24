import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Select, { SelectOption } from '../../select/Select';
import * as exampleCss from '../styles/example.css';

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
		const {
			value = 'option1'
		} = this.state;

		return v('div', [
			w(Select, {
				key: 'select1',
				label: 'Try changing me',
				options: this._selectOptions,
				useNativeSelect: true,
				value: <string> value,
				onChange: (value: string) => {
					this.setState({ value: value });
				}
			}),
			v('p', {
				innerHTML: 'Result: ' + this.state.value
			}),
			v('h2', {}, [ 'Custom Select Box, single select:' ]),
			w(Select, {
				key: 'select3',
				overrideClasses: exampleCss,
				label: 'Custom box!',
				options: this._selectOptions,
				value: <string> value,
				renderOption: (option: SelectOption) => {
					return v('div', {
						classes: this.classes(exampleCss.option),
						innerHTML: option.label
					});
				},
				onChange: (value: string) => {
					console.log('changing custom select with event', value);
					// this.setState({ value: event.target})
				}
			}),
			v('h2', {}, [ 'Native multiselect widget' ]),
			w(Select, {
				key: 'select2',
				options: this._selectOptions,
				useNativeSelect: true,
				multiple: true,
				value: <string> value,
				onChange: (value: string) => {
					this.setState({ value: value });
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
				}
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
