import { create, tsx } from '@dojo/framework/core/vdom';
import Tree, { TreeNode } from '@dojo/widgets/tree';
import Icon from '@dojo/widgets/icon';

const factory = create();

export default factory(function CustomIcons() {
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

	return (
		<Tree nodes={nodes}>
			{(node) => (
				<div styles={{ display: 'flex' }}>
					<div styles={{ marginRight: '5px' }}>
						<Icon type="alertIcon" />
					</div>
					<div>{node.value}</div>
				</div>
			)}
		</Tree>
	);
});
