import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createResource } from '@dojo/framework/core/resource';

const factory = create({ icache });

const animals = [
	{ name: 'whiskers', type: 'feline' },
	{ name: 'fido', type: 'kanine' },
	{ name: 'mickey', type: 'rodent' }
];

const resource = createResource();

export default factory(function CustomTransformer({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={resource(animals)}
				transform={{
					value: ['type'],
					label: ['name']
				}}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
