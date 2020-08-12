import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
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
	},
	{
		id: 'parent-2',
		value: 'parent 2'
	},
	{
		id: 'parent-2-0',
		value: 'parent 2-0',
		parent: 'parent-2'
	},
	{
		id: 'leaf-2-0-1',
		value: 'leaf',
		parent: 'parent-2-0'
	},
	{
		id: 'leaf-2-0-2',
		value: 'leaf',
		parent: 'parent-2-0'
	},
	{
		id: 'parent-2-1',
		value: 'parent 2-1',
		parent: 'parent-1'
	},
	{
		id: 'leaf-2-1-1',
		value: 'leaf',
		parent: 'parent-2-1'
	}
];
const template = createMemoryResourceTemplate<TreeNodeOption>();

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
