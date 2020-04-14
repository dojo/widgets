import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithDataAndFilter } from '../list/memoryTemplate';
import MultiSelectTypeahead from '@dojo/widgets/multi-select-typeahead';
import Icon from '@dojo/widgets/icon';

const factory = create({ icache });
const options = [
	{ value: 'cat', label: 'Cat' },
	{ value: 'dog', label: 'Dog' },
	{ value: 'fish', label: 'Fish' }
];

const resource = createMemoryResourceWithDataAndFilter(options);

export default factory(function Controlled({ middleware: { icache } }) {
	return (
		<virtual>
			<MultiSelectTypeahead
				resource={resource}
				transform={defaultTransform}
				value={icache.getOrSet('value', [])}
				onValue={(value) => icache.set('value', value)}
			>
				{{
					label: 'Multi Select Typeahead'
				}}
			</MultiSelectTypeahead>
			<br />
			<div>
				The selected values are:
				<ul>
					{icache.getOrSet('value', []).map((value, index) => (
						<li key={value}>
							<a
								href="#"
								onclick={(event) => {
									event.preventDefault();
									const value = icache.getOrSet('value', []);
									value.splice(index, 1);
									icache.set('value', value);
								}}
							>
								{value} <Icon type="closeIcon" />
							</a>
						</li>
					))}
				</ul>
			</div>
		</virtual>
	);
});
