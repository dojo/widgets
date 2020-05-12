import { create, tsx } from '@dojo/framework/core/vdom';
import Tree, { TreeNode } from '@dojo/widgets/tree';

const factory = create();

export default factory(function CustomIcons() {
	const nodes: TreeNode[] = [
		{
			content: 'Settings',
			expanded: true,
			icon: 'settingsIcon',
			children: [
				{
					content: 'Appearance',
					expanded: true,
					icon: 'eyeIcon',
					children: [
						{
							content: 'Item'
						},
						{
							content: 'Item'
						}
					]
				},
				{
					content: 'Notifications',
					expanded: true,
					icon: 'alertIcon',
					children: [
						{
							content: 'Item'
						}
					]
				}
			]
		}
	];

	return <Tree nodes={nodes} />;
});
