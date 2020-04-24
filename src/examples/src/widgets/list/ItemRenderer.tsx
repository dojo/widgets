import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform, ListItem } from '@dojo/widgets/list';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createResource } from '@dojo/framework/core/resource';

const factory = create({ icache });
const resource = createResource();

export default factory(function ItemRenderer({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={resource(states)}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
			>
				{({ value }, props) => {
					const color = value.length > 7 ? 'red' : 'blue';
					return (
						<ListItem {...props}>
							<div styles={{ color: color }}>{value}</div>
						</ListItem>
					);
				}}
			</List>
			<p>{`Clicked On: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
