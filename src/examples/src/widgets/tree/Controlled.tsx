import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Tree, { TreeNode } from '@dojo/widgets/tree';
import Example from '../../Example';

interface ControlledCache {
	expanded?: string[];
	checked?: string[];
}
const resource = createResourceMiddleware();
const icache = createICacheMiddleware<ControlledCache>();
const factory = create({ icache, resource });
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

export default factory(function Advanced({ id, middleware: { icache, resource } }) {
	const expanded = icache.get('expanded');
	const checked = icache.get('checked');

	return (
		<Example>
			<Tree
				checkable={true}
				selectable={true}
				expandedNodes={expanded}
				checkedNodes={checked}
				resource={resource({ template, initOptions: { id, data: nodes } })}
			/>
			<ul>
				<li>
					<button
						onclick={() => {
							icache.set('expanded', expanded ? undefined : ['parent-1']);
						}}
					>
						Toggle Expand
					</button>
				</li>
				<li>
					<button
						onclick={() => {
							icache.set('checked', checked ? undefined : ['parent-1']);
						}}
					>
						Toggle Checked
					</button>
				</li>
			</ul>
		</Example>
	);
});
