import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createResourceMiddleware,
	defaultFind,
	createResourceTemplate
} from '@dojo/framework/core/middleware/resources';
import Example from '../../Example';
import Tree, { TreeNodeOption } from '@dojo/widgets/tree';

const resource = createResourceMiddleware();
const factory = create({ resource });

enum Category {
	repo = 'repo',
	contributer = 'contributer'
}

interface RemoteNodeTreeOption extends TreeNodeOption {
	remoteSource: string;
	category: Category;
}

const template = createResourceTemplate<RemoteNodeTreeOption>({
	find: defaultFind,
	read: async (request, { put, get }) => {
		let { data: nodes } = get();

		const { query, size } = request;

		console.log('size', size);

		if (query.id) {
			const selectedNode = nodes.find((value: any) => value.id === query.id);
			const hasQueredChildren = !!nodes.find((value: any) => value.parent === query.id);

			if (selectedNode && selectedNode.category === Category.repo && !hasQueredChildren) {
				// Fetch second tree level
				const response = await fetch(selectedNode.remoteSource, {
					headers: {
						'Content-Type': 'application/json'
					}
				});
				const data = await response.json();

				nodes = [
					...data.map((value: any) => {
						return {
							id: value.id,
							value: value.login,
							category: Category.contributer,
							parent: query.id
						};
					}),
					...nodes
				];
			}
		}

		if (nodes.length === 0) {
			const initialUrl = 'https://api.github.com/orgs/dojo/repos';

			const response = await fetch(initialUrl, {
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data = await response.json();
			nodes = data.map((node: any) => {
				return {
					id: node.id,
					value: node.full_name,
					hasChildren: true,
					remoteSource: node.contributors_url,
					category: Category.repo
				};
			});
		}

		console.log('UPDATED NODES', nodes);
		console.log('NODES LENGTH', nodes.length);

		put(
			{
				data: nodes,
				total: nodes.length
			},
			{
				...request,
				size: nodes.length
			}
		);
	}
});

export default factory(function Remote({ id, middleware: { resource } }) {
	return (
		<Example>
			<Tree
				checkable={true}
				resource={resource({
					template,
					transform: { id: 'id', value: 'value', parent: 'parent' }
				})}
			/>
		</Example>
	);
});
