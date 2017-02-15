import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import { createQueryStore } from '@dojo/stores/store/mixins/createQueryTransformMixin';
import ComboBox from '../../combobox/ComboBox';

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

const store = createQueryStore({ data: data });

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	onRequestResults(value: string) {
		const queryResults = store.filter(item => {
			const match = item.value.toLowerCase().match(new RegExp('^' + value.toLowerCase()));
			return Boolean(match && match.length > 0);
		});

		queryResults.fetch().then(results => {
			this.setState({ results: results });
		});
	}

	render() {
		return v('div', [
			w(ComboBox, {
				onRequestResults: this.onRequestResults,
				resultKey: 'value',
				results: <{[key: string]: any}[]> this.state['results'],
				initialValue: 'North Carolina'
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector({});

projector.append();
