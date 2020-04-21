import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithDataAndFilter } from '../list/memoryTemplate';
import Typeahead from '@dojo/widgets/typeahead';
import states from './states';
import Example from '../../Example';

const factory = create({ icache });

const resource = createMemoryResourceWithDataAndFilter(states, (query, option) => {
	let filterText = '';

	query.forEach(({ keys, value }) => {
		if (keys.indexOf('value') >= 0) {
			filterText = value || '';
		}
	});

	if (!filterText) {
		return true;
	}

	if (filterText.length <= 2) {
		return option.value.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) === 0;
	} else {
		return option.label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) >= 0;
	}
});

export default factory(function CustomFilter({ middleware: { icache } }) {
	return (
		<Example>
			<Typeahead
				resource={resource}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Custom Filter'
				}}
			</Typeahead>
			<pre>{icache.getOrSet('value', '')}</pre>
		</Example>
	);
});
