import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';
import states from './states';
import { createMemoryResource } from '@dojo/widgets/common/memoryResource';

const resource = createMemoryResource(states, (item, query) => {
	return item.value.toLowerCase().indexOf(query.toLowerCase()) === 0;
});

const factory = create({ icache });

export default factory(function MemoryResource({ middleware: { icache } }) {
	return (
		<virtual>
			<Menu
				resource={resource}
				transform={(item) => item}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
				itemsInView={10}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
