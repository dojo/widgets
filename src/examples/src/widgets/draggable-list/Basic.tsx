import { create, tsx } from '@dojo/framework/core/vdom';
import DraggableList, { move } from '@dojo/widgets/draggable-list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const items = icache.getOrSet('items', () => [
		{
			content: 'Item 1',
			key: '1'
		},
		{
			content: 'Item 2',
			key: '2'
		},
		{
			content: 'Item 3',
			key: '3'
		},
		{
			content: 'Item 4',
			key: '4'
		},
		{
			content: 'Item 5',
			key: '5'
		},
		{
			content: 'Item 6',
			key: '6'
		},
		{
			content: 'Item 7',
			key: '7'
		},
		{
			content: 'Item 8',
			key: '8'
		},
		{
			content: 'Item 9',
			key: '9'
		}
	]);

	return (
		<Example>
			<DraggableList onMove={(from, to) => icache.set('items', move(items, from, to))}>
				{items}
			</DraggableList>
		</Example>
	);
});
