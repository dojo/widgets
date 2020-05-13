import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Tree, { TreeNode } from '@dojo/widgets/tree';

const factory = create({ icache });

export default factory(function Advanced({ middleware: { icache } }) {
	const nodes: TreeNode[] = icache.getOrSet('nodes', [
		{
			content: 'parent 1',
			expanded: true,
			children: [
				{
					content: 'parent 1-0',
					expanded: true,
					children: [
						{
							content: 'leaf'
						},
						{
							content: 'leaf'
						}
					]
				},
				{
					content: 'parent 1-1',
					expanded: true,
					children: [
						{
							content: 'sss'
						}
					]
				}
			]
		}
	]);

	return (
		<div>
			<Tree nodes={nodes} checkable={true} selectable={true} />
			<ul>
				<li>
					<button
						onclick={() => {
							nodes[0].expanded = !nodes[0].expanded;
							icache.set('nodes', nodes);
						}}
					>
						Toggle Expand
					</button>
				</li>
				<li>
					<button
						onclick={() => {
							nodes[0].checked = !nodes[0].checked;
							icache.set('nodes', nodes);
						}}
					>
						Toggle Checked
					</button>
				</li>
			</ul>
		</div>
	);
});
