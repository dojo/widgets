import { DNode } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import ComboBox from '../ComboBox';

const data = [
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
	{ value: 'Oklahoma' },
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

export class App extends WidgetBase<WidgetProperties> {
	private _results: any[];
	private _value1 = '';
	private _value2 = '';
	private _value5 = '';
	private _value8 = '';
	private _value9 = '';
	private _invalid: boolean;

	onChange(value: string, key?: string) {
		if (!key) {
			return;
		}

		(this as any)[`_value${key}`] = value;
		this.invalidate();
	}

	onRequestResults(key: string) {
		const value = (this as any)[`_value${key}`];
		const results = data.filter(item => {
			const match = item.value.toLowerCase().match(new RegExp('^' + value.toLowerCase()));
			return Boolean(match && match.length > 0);
		});

		this._results = results.sort((a, b) => a.value < b.value ? -1 : 1);
		this.invalidate();
	}

	render(): DNode {
		const {
			onChange,
			onRequestResults
		} = this;

		return v('div', {
			styles: { maxWidth: '256px' }
		}, [
			v('h1', ['ComboBox Examples']),
			v('h3', ['Clearable']),
			w(ComboBox, {
				key: '2',
				clearable: true,
				onChange,
				getResultLabel: (result: any) => result.value,
				onRequestResults,
				results: this._results,
				value: this._value2,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', ['Open on focus']),
			w(ComboBox, {
				key: '1',
				openOnFocus: true,
				onChange,
				getResultLabel: (result: any) => result.value,
				onRequestResults,
				results: this._results,
				value: this._value1,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', ['Disabled menu items']),
			w(ComboBox, {
				key: '5',
				onChange,
				getResultLabel: (result: any) => result.value,
				onRequestResults,
				results: this._results,
				value: this._value5,
				isResultDisabled: (result: any) => result.value.length > 9,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', ['Disabled']),
			w(ComboBox, {
				key: '6',
				disabled: true,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', ['Read Only']),
			w(ComboBox, {
				key: '7',
				readOnly: true,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', ['Label']),
			w(ComboBox, {
				key: '8',
				onChange,
				getResultLabel: (result: any) => result.value,
				onRequestResults,
				results: this._results,
				value: this._value8,
				label: 'Enter a value'
			}),
			v('h3', ['Required and validated']),
			w(ComboBox, {
				key: '9',
				required: true,
				onChange: (value: string) => {
					this._value9 = value;
					this._invalid = value.trim().length === 0;
					this.invalidate();
				},
				getResultLabel: (result: any) => result.value,
				onRequestResults,
				results: this._results,
				value: this._value9,
				invalid: this._invalid,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
