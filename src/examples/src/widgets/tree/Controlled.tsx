import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Tree, { TreeNodeOption } from '@dojo/widgets/tree';
import Example from '../../Example';

interface ControlledCache {
	expanded?: string[];
	checked?: string[];
}
const resource = createResourceMiddleware();
const icache = createICacheMiddleware<ControlledCache>();
const factory = create({ icache, resource });
const nodes: TreeNodeOption[] = [
	{
		id: '851c1eea',
		value: 'parent 1',
		parent: 'root'
	},
	{
		id: '8ef88e80',
		value: 'parent 1-0',
		parent: '851c1eea'
	},
	{
		id: 'a4ed7462',
		value: 'child 1',
		parent: '8ef88e80'
	},
	{
		id: 'b055cda4',
		value: 'child 2',
		parent: '8ef88e80'
	},
	{
		id: 'becc2f0e',
		value: 'parent 1-1',
		parent: '851c1eea'
	},
	{
		id: 'c35ca04e',
		value: 'child 3',
		parent: 'becc2f0e'
	}
];
const template = createMemoryResourceTemplate<TreeNodeOption>();

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
							icache.set('expanded', expanded ? undefined : ['851c1eea']);
						}}
					>
						Toggle Expand
					</button>
				</li>
				<li>
					<button
						onclick={() => {
							icache.set('checked', checked ? undefined : ['851c1eea']);
						}}
					>
						Toggle Checked
					</button>
				</li>
			</ul>
		</Example>
	);
});
