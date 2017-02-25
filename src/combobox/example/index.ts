import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import ComboBox from '../../combobox/ComboBox';
import { DNode, HNode } from '@dojo/widget-core/interfaces';

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
			v('h1', {}, ['ComboBox Examples']),
			v('h3', {}, ['Open on focus']),
			w(ComboBox, {
				openOnFocus: true,
				onChange: (value: string) => this.setState({ 'value1': value }),
				getResultValue: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				results: <any[]> this.state['results'],
				value: <string> this.state['value1'],
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', {}, ['Clearable']),
			w(ComboBox, {
				clearable: true,
				onChange: (value: string) => this.setState({ 'value2': value }),
				getResultValue: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				results: <any[]> this.state['results'],
				value: <string> this.state['value2'],
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', {}, ['Custom result renderer']),
			w(ComboBox, {
				openOnFocus: true,
				onChange: (value: string) => this.setState({ 'value3': value }),
				getResultValue: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				renderResult: (result: any) => {
					return v('div', [
						v('img', {
							src: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/300px-Flag_of_the_United_States.svg.png',
							styles: {
								paddingRight: '8px',
								width: '25px',
								height: 'auto'
							}
						}),
						result.value
					]);
				},
				results: <any[]> this.state['results'],
				value: <string> this.state['value3'],
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', {}, ['Custom menu renderer']),
			w(ComboBox, {
				onChange: (value: string) => this.setState({ 'value4': value }),
				getResultValue: (result: any) => <string> result.value,
				onRequestResults: this.onRequestResults,
				results: <any[]> this.state['results'],
				value: <string> this.state['value4'],
				renderMenu: (resultItems: DNode[]) => {
					const items = [
						v('div', {
							classes: { header: true }
						}, [ 'A' ])
					];
					let lastLetter = 'a';
					resultItems.forEach(item => {
						let state = (<HNode> item).children[0]!;
						let letter = (<string> state).charAt(0).toLowerCase();
						if (letter !== lastLetter) {
							items.push(v('div', {
								classes: { header: true }
							}, [ letter.toUpperCase() ]));
							lastLetter = letter;
						}
						items.push(<HNode> item);
					});
					return v('div', { classes: { results: true } }, items);
				},
				inputProperties: {
					placeholder: 'Enter a value'
				}
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector({});

projector.append();
