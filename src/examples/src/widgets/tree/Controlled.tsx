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
		id: 'c9ae529a',
		value: 'parent 1',
		parent: 'root',
		hasChildren: true
	},
	{
		id: 'cde74420',
		value: 'parent 1-0',
		parent: 'c9ae529a',
		hasChildren: true
	},
	{
		id: 'e2065522',
		value: 'parent 1-1',
		parent: 'c9ae529a',
		hasChildren: true
	},
	{
		id: 'de48r11ea',
		value: 'child-1',
		parent: 'cde74420',
		hasChildren: false
	},
	{
		id: 'd8fada34',
		value: 'child-2',
		parent: 'cde74420',
		hasChildren: false
	},
	{
		id: 'e73a11b4',
		value: 'child-3',
		parent: 'e2065522',
		hasChildren: false
	}
];
const template = createMemoryResourceTemplate<TreeNodeOption>();

export default factory(function Advanced({ id, middleware: { icache, resource } }) {
	const expanded = icache.getOrSet('expanded', []);
	const checked = icache.getOrSet('checked', []);

	return (
		<Example>
			<Tree
				checkable={true}
				selectable={true}
				onExpand={(ids) => {}}
				expandedIds={expanded}
				checkedIds={checked}
				resource={resource({ template, initOptions: { id, data: nodes } })}
			/>
			<ul>
				<li>
					<button
						onclick={() => {
							icache.set(
								'expanded',
								expanded && expanded.length !== 0 ? [] : ['c9ae529a', 'cde74420']
							);
						}}
					>
						Toggle Expand
					</button>
				</li>
				<li>
					<button
						onclick={() => {
							icache.set(
								'checked',
								checked && checked.length !== 0 ? [] : ['de48r11ea']
							);
						}}
					>
						Toggle Checked
					</button>
				</li>
			</ul>
		</Example>
	);
});
