import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import ComboBox from '../ComboBox';
import { DNode, WNode } from '@dojo/widget-core/interfaces';
import ResultItem, { ResultItemProperties } from '../ResultItem';
import ResultMenu from '../ResultMenu';

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

class CustomResultItem extends ResultItem {
	renderLabel(result: any) {
		const { label } = this.properties;

		return v('div', [
			v('img', {
				src: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/300px-Flag_of_the_United_States.svg.png',
				styles: {
					paddingRight: '8px',
					width: '25px',
					height: 'auto'
				}
			}),
			label
		]);
	}
}

class CustomResultMenu extends ResultMenu {
	renderResults(results: WNode[]) {
		const items: any[] = [
			v('div', {
				styles: {
					fontWeight: 'bold',
					padding: '0.5em 1em',
					background: '#EEE'
				}
			}, [ 'A' ])
		];

		let lastLetter = 'a';

		results.forEach(item => {
			let state = (<ResultItemProperties> (<WNode> item).properties).label;
			let letter = state.charAt(0).toLowerCase();
			if (letter !== lastLetter) {
				items.push(v('div', {
					styles: {
						fontWeight: 'bold',
						padding: '0.5em 1em',
						background: '#EEE'
					}
				}, [ letter.toUpperCase() ]));
				lastLetter = letter;
			}
			items.push(item);
		});

		return items;
	}
}

class CustomResultItemDisabled extends ResultItem {
	isDisabled() {
		const { label } = this.properties;

		return label.length > 9;
	}
}

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	onRequestResults(value: string) {
		const results = data.filter(item => {
			const match = item.value.toLowerCase().match(new RegExp('^' + value.toLowerCase()));
			return Boolean(match && match.length > 0);
		});

		this.setState({ results: results.sort((a, b) => a.value < b.value ? -1 : 1) });
	}

	render(): DNode {
		return v('div', [
			v('h1', ['ComboBox Examples']),
			v('h3', ['Open on focus']),
			w(ComboBox, {
				key: '1',
				openOnFocus: true,
				onChange: (value: string) => this.setState({ 'value1': value }),
				getResultLabel: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				results: <any[]> this.state['results'],
				value: <string> this.state['value1'],
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', ['Clearable']),
			w(ComboBox, {
				key: '2',
				clearable: true,
				onChange: (value: string) => this.setState({ 'value2': value }),
				getResultLabel: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				results: <any[]> this.state['results'],
				value: <string> this.state['value2'],
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', ['Custom result renderer']),
			w(ComboBox, {
				key: '3',
				openOnFocus: true,
				onChange: (value: string) => this.setState({ 'value3': value }),
				getResultLabel: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				customResultItem: CustomResultItem,
				results: <any[]> this.state['results'],
				value: <string> this.state['value3'],
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', ['Custom menu renderer']),
			w(ComboBox, {
				key: '4',
				onChange: (value: string) => this.setState({ 'value4': value }),
				getResultLabel: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				results: <any[]> this.state['results'],
				value: <string> this.state['value4'],
				customResultMenu: CustomResultMenu,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', ['Disabled menu items']),
			w(ComboBox, {
				key: '5',
				onChange: (value: string) => this.setState({ 'value5': value }),
				getResultLabel: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				results: <any[]> this.state['results'],
				value: <string> this.state['value5'],
				customResultItem: CustomResultItemDisabled,
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
				onChange: (value: string) => this.setState({ 'value8': value }),
				getResultLabel: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				results: <any[]> this.state['results'],
				value: <string> this.state['value8'],
				label: 'Enter a value'
			}),
			v('h3', ['Required and validated']),
			w(ComboBox, {
				key: '9',
				required: true,
				onChange: (value: string) => this.setState({
					'value9': value,
					invalid: value.trim().length === 0
				}),
				getResultLabel: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				results: <any[]> this.state['results'],
				value: <string> this.state['value9'],
				invalid: <boolean> this.state.invalid,
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
