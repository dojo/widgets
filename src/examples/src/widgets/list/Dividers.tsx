import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createResource } from '@dojo/framework/core/resource';

const factory = create({ icache });
const options = [
	{ value: 'Save' },
	{ value: 'Delete', divider: true },
	{ value: 'copy', label: 'Copy' },
	{ value: 'Paste', disabled: true, divider: true },
	{ value: 'Edit' }
];

const resource = createResource();

export default factory(function Dividers({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={resource(options)}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
