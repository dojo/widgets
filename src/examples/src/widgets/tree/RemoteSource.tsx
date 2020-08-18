import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createResourceMiddleware,
	defaultFind,
	createResourceTemplate
} from '@dojo/framework/core/middleware/resources';
import Example from '../../Example';
import Tree, { TreeNodeOption } from '@dojo/widgets/tree';

const template = createResourceTemplate<TreeNodeOption>({
	find: defaultFind,
	read: async (request, { put, get }) => {
		const { query } = request;
		let data: TreeNodeOption[] = [];

		if (query.parent !== 'root') {
			const response = await fetch(`https://www.dnd5eapi.co/api/races/${query.parent}`, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const parsedData = await response.json();
			data = parsedData.traits.map((value: { url: string; name: string }) => {
				return {
					id: `${query.parent}-${value.name}`,
					value: value.name,
					hasChildren: false,
					parent: query.parent
				};
			});
		}

		if (query.parent === 'root') {
			const initialUrl = 'https://www.dnd5eapi.co/api/races';
			const response = await fetch(initialUrl, {
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const parsedData = await response.json();
			data = parsedData.results.map((value: { index: string; name: string; url: string }) => {
				return {
					id: value.index,
					value: value.name,
					hasChildren: true,
					parent: 'root'
				};
			});
		}

		put(
			{
				data,
				total: 30
			},
			{
				...request,
				size: 30
			}
		);
	}
});

const resource = createResourceMiddleware();
const factory = create({ resource });

export default factory(function Remote({ id, middleware: { resource } }) {
	return (
		<Example>
			<Tree
				checkable={true}
				resource={resource({
					template,
					transform: {
						id: 'id',
						value: 'value',
						parent: 'parent',
						hasChildren: 'hasChildren'
					}
				})}
			/>
		</Example>
	);
});
