import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import Tree, { TreeNodeOption } from '@dojo/widgets/tree';
import Example from '../../Example';

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
		id: 'leaf-1-0-0',
		value: 'leaf',
		parent: 'parent-1-0'
	},
	{
		id: 'leaf-1-0-1',
		value: 'leaf',
		parent: 'parent-1-0'
	},
	{
		id: 'parent-1-1',
		value: 'parent 1-1',
		parent: 'parent-1'
	},
	{
		id: 'leaf-1-1-0',
		value: 'leaf',
		parent: 'parent-1-1'
	}
];
const template = createMemoryResourceTemplate<TreeNodeOption>();

export default factory(function Checkable({ id, middleware: { resource } }) {
	return (
		<Example>
			<Tree
				checkable={true}
				resource={resource({ template, initOptions: { id, data: nodes } })}
			/>
		</Example>
	);
});
