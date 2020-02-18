import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';
import states from './states';
import { createResource } from '@dojo/widgets/common/resource';
import FetchedResource from './FetchedResource';

const factory = create({ icache });

const animals = [{ value: 'cat' }, { value: 'dog' }, { value: 'mouse' }];

const personResource = createResource({
	// why did i get here?
	// do transform
	read: ({ query = '', size, offset }, put, get) => {
		const data = get('');

		if (size !== undefined && offset !== undefined) {
			put(0, data);
			return { data: data.slice(offset, offset + size), total: data.length };
		} else {
			return { data, total: data.length };
		}
	}
});

export default factory(function MemoryResource({ middleware: { icache } }) {
	const toggled = icache.getOrSet('toggled', false);
	return (
		<virtual>
			<Menu
				resource={{ resource: personResource, data: animals }}
				transform={(item) => item}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
				itemsInView={10}
			/>
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					const toggled = icache.getOrSet('toggled', false);
					icache.set('toggled', !toggled);
				}}
			>
				click to change array
			</button>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
