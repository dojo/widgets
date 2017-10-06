import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Listbox from '../Listbox';
import dojoTheme from '../../themes/dojo/theme';

interface CustomOption {
	value: string;
	label: string;
	selected?: boolean;
	disabled?: boolean;
}

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _listboxIndex = 0;

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	_options: any[] = [
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
			w(Listbox, {
				key: 'select1',
				activeIndex: this._listboxIndex,
				optionData: this._options,
				theme: this._theme,
				getOptionLabel: (option: CustomOption) => option.label,
				getOptionDisabled: (option: CustomOption) => !!option.disabled,
				getOptionSelected: (option: CustomOption) => !!option.selected,
				onActiveIndexChange: (index: number) => {
					this._listboxIndex = index;
					this.invalidate();
				},
				onOptionSelect: (option: any, index: number) => {
					this._options[index].selected = !this._options[index].selected;
					this._options = [ ...this._options ];
					this.invalidate();
				}
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
