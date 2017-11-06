import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Listbox from '../Listbox';
import dojoTheme from '../../themes/dojo/theme';

interface CustomOption {
	disabled?: boolean;
	label?: string;
	selected?: boolean;
	value: string;
}

export class App extends WidgetBase<WidgetProperties> {
	private _listbox1Index = 0;
	private _listbox1Value: string;
	private _listbox2Index = 0;
	private _theme: {};

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	_options: CustomOption[] = [
		{ value: 'Maine' },
		{ value: 'New Hampshire' },
		{ value: 'Vermont' },
		{ value: 'Massachusetts' },
		{ value: 'Connecticut' },
		{ value: 'Rhode Island' },
		{ value: 'New York' },
		{ value: 'New Jersey' },
		{ value: 'Pennsylvania' },
		{ value: 'Delaware' },
		{ value: 'Maryland' },
		{ value: 'Virginia' },
		{ value: 'Florida' },
		{ value: 'Texas' },
		{ value: 'Kentucky' },
		{ value: 'Tennessee' },
		{ value: 'North Carolina' },
		{ value: 'South Carolina' },
		{ value: 'Georgia' },
		{ value: 'Alabama' },
		{ value: 'Mississippi' },
		{ value: 'Arkansas' },
		{ value: 'Louisiana' },
		{ value: 'Missouri' },
		{ value: 'Oklahoma', disabled: true },
		{ value: 'Ohio' },
		{ value: 'Nebraska' },
		{ value: 'Michigan' },
		{ value: 'Indiana' },
		{ value: 'Wisconsin' },
		{ value: 'Illinois' },
		{ value: 'Minnesota' },
		{ value: 'Iowa' },
		{ value: 'North Dakota' },
		{ value: 'South Dakota' },
		{ value: 'Kansas' },
		{ value: 'Colorado' },
		{ value: 'New Mexico' },
		{ value: 'Arizona' },
		{ value: 'Nevada' },
		{ value: 'California' },
		{ value: 'Wyoming' },
		{ value: 'Montana' },
		{ value: 'Utah' },
		{ value: 'Idaho' },
		{ value: 'Washington' },
		{ value: 'Oregon' },
		{ value: 'Alaska' },
		{ value: 'Hawaii' },
		{ value: 'West Virginia' }
	];

	_moreOptions: CustomOption[] = [
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
			v('label', { for: 'listbox1' }, [ 'Single-select listbox example' ]),
			w(Listbox, {
				key: 'listbox1',
				activeIndex: this._listbox1Index,
				id: 'listbox1',
				optionData: this._options,
				theme: this._theme,
				getOptionLabel: (option: CustomOption) => option.value,
				getOptionDisabled: (option: CustomOption) => !!option.disabled,
				getOptionSelected: (option: CustomOption) => option.value === this._listbox1Value,
				onActiveIndexChange: (index: number) => {
					this._listbox1Index = index;
					this.invalidate();
				},
				onOptionSelect: (option: any, index: number) => {
					this._listbox1Value = option.value;
					this._options = [ ...this._options ];
					this.invalidate();
				}
			}),
			v('br'),
			v('label', { for: 'listbox2' }, [ 'Multi-select listbox example' ]),
			w(Listbox, {
				key: 'listbox2',
				activeIndex: this._listbox2Index,
				id: 'listbox2',
				optionData: this._moreOptions,
				theme: this._theme,
				getOptionLabel: (option: CustomOption) => option.label,
				getOptionDisabled: (option: CustomOption) => !!option.disabled,
				getOptionSelected: (option: CustomOption) => !!option.selected,
				onActiveIndexChange: (index: number) => {
					this._listbox2Index = index;
					this.invalidate();
				},
				onOptionSelect: (option: any, index: number) => {
					this._moreOptions[index].selected = !this._moreOptions[index].selected;
					this._moreOptions = [ ...this._moreOptions ];
					this.invalidate();
				}
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
