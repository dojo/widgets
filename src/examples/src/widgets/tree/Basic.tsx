import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import Example from '../../Example';
import Tree, { TreeNode } from '@dojo/widgets/tree';

const resource = createResourceMiddleware();
const factory = create({ resource });
const nodes: TreeNode[] = [
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
const template = createMemoryResourceTemplate<TreeNode>();

export default factory(function Basic({ id, middleware: { resource } }) {
	return (
		<Example>
			<Tree
				selectable={true}
				resource={resource({ template, initOptions: { id, data: nodes } })}
			/>
		</Example>
	);
});
