import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import Typeahead from '@dojo/widgets/typeahead';
import states from './states';
import Example from '../../Example';
import { createResource, createMemoryTemplate } from '@dojo/framework/core/resource';

const factory = create({ icache });

const resource = createResource<{ value: string; label: string }>(
	createMemoryTemplate({
		filter: (query, option) => {
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
				return (
					option.value.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) === 0
				);
			} else {
				return (
					option.label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) >= 0
				);
			}
		}
	})
);

export default factory(function CustomFilter({ middleware: { icache } }) {
	return (
		<Example>
			<Typeahead
				resource={resource(states)}
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
