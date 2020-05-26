import { create, tsx } from '@dojo/framework/core/vdom';
import Tree, { TreeNode } from '@dojo/widgets/tree';
import Example from '../../Example';

const factory = create();

export default factory(function Checkable() {
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

	return (
		<Example>
			<Tree nodes={nodes} checkable={true} />
		</Example>
	);
});
