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
const nodes: TreeNodeOption[] = [
	{
		id: 'parent-1',
		value: 'parent 1'
	},
	{
		id: 'parent-1-0',
		value: 'parent 1-0',
		parent: 'parent-1'
	},
	{
		id: 'leaf-1-0-1',
		value: 'leaf',
		parent: 'parent-1-0'
	},
	{
		id: 'leaf-1-0-2',
		value: 'leaf',
		parent: 'parent-1-0'
	},
	{
		id: 'parent-1-1',
		value: 'parent 1-1',
		parent: 'parent-1'
	},
	{
		id: 'leaf-1-1-1',
		value: 'leaf',
		parent: 'parent-1-1'
	}
];

const template = createResourceTemplate<TreeNodeOption>({
	find: defaultFind,
	read: async (request, { put }) => {
		const asyncNodes: Promise<TreeNodeOption[]> = new Promise((resolve) => {
			setTimeout(() => {
				resolve(nodes);
			}, 5000);
		});

		const nodeData: TreeNodeOption[] = await asyncNodes;

		put(
			{
				data: nodeData,
				total: 13
			},
			request
		);
	}
});

export default factory(function Basic({ id, middleware: { resource } }) {
	const onCheck = (node: string, checked: boolean) => {};
	return (
		<Example>
			<Tree selectable={true} resource={resource({ template })} onCheck={onCheck} />
		</Example>
	);
});
