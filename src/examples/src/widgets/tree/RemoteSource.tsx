import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createResourceMiddleware,
	defaultFind,
	createResourceTemplate
} from '@dojo/framework/core/middleware/resources';
import Example from '../../Example';
import Tree, { TreeNodeOption } from '@dojo/widgets/tree';
import icache from '@dojo/framework/core/middleware/icache';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

enum Category {
	repo = 'repo',
	contributer = 'contributer'
}

export default factory(function Remote({ id, middleware: { icache, resource } }) {
	const template = createResourceTemplate<TreeNodeOption>({
		find: defaultFind,
		read: async (request, { put }) => {
			const { query } = request;
			if (!icache.get('data')) {
				icache.set('data', []);
			}

			if (query.id) {
				const selectedNode = icache.get('data').find((value: any) => value.id === query.id);
				const hasQueredChildren = !!icache
					.get('data')
					.find((value: any) => value.parent === query.id);
				console.log('hasQueredChildren', hasQueredChildren);
				console.log('selectedNode', selectedNode);

				if (selectedNode && selectedNode.category === Category.repo && !hasQueredChildren) {
					// Fetch second tree level
					const response = await fetch(selectedNode.remoteSource, {
						headers: {
							'Content-Type': 'application/json'
						}
					});
					const data = await response.json();

					icache.set('data', [
						...icache.get('data'),
						...data.map((value: any) => {
							return {
								id: value.id,
								value: value.login,
								category: Category.contributer,
								parent: query.id
							};
						})
					]);
				}
			}

			if (icache.get('data').length === 0) {
				console.log('gets here');
				const initialUrl = 'https://api.github.com/orgs/dojo/repos';

				const response = await fetch(initialUrl, {
					headers: {
						'Content-Type': 'application/json'
					}
				});

				const data = await response.json();
				console.log('returned data', data);
				icache.set(
					'data',
					data.map((value: any) => {
						console.log('value', value);
						return {
							id: value.id,
							remoteSource: value.contributors_url,
							value: value.full_name,
							category: Category.repo
						};
					})
				);
			}
			const nodes = icache.get('data').map((node: any) => {
				return {
					id: node.id,
					value: node.value,
					parent: node.parent
				};
			});

			console.log('nodes', nodes);
			console.log('data', icache.get('data'));

			put(
				{
					data: nodes,
					total: nodes.length
				},
				request
			);
		}
	});
	return (
		<Example>
			<Tree checkable={true} resource={resource({ template })} />
		</Example>
	);
});
