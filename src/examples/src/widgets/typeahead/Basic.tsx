import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Typeahead from '@dojo/widgets/typeahead';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware,
	defaultFilter
} from '@dojo/framework/core/middleware/resources';
import { largeListOptions } from '../../data';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

const dataWithDisabled = largeListOptions.map((item) => ({
	...item,
	disabled: Math.random() < 0.1
}));

export const listOptionTemplate = createResourceTemplate<ListOption>({
	idKey: 'value',
	read: async (req, { put }) => {
		// emulate an async request
		await new Promise((res) => setTimeout(res, 1000));
		const { offset, size, query } = req;
		const filteredData = dataWithDisabled.filter((item) => defaultFilter(query, item));
		put({ data: filteredData.slice(offset, offset + size), total: filteredData.length }, req);
	}
});

export default factory(function Basic({ middleware: { icache, resource } }) {
	const strict = icache.getOrSet('strict', true);
	return (
		<Example>
			<Typeahead
				initialValue={'bfae9901-4c4a-4dc1-8f0b-ac7c60c5976a-418'}
				strict={strict}
				resource={resource({
					template: listOptionTemplate
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Basic Typeahead'
				}}
			</Typeahead>
			<button onclick={() => icache.set('strict', (strict = true) => !strict)}>
				{strict ? 'Non strict' : 'strict'}
			</button>
			<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
		</Example>
	);
});
