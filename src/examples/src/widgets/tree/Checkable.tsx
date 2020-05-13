import { create, tsx } from '@dojo/framework/core/vdom';
import Tree from '@dojo/widgets/tree';

const factory = create();

export default factory(function Checkable() {
	const nodes = [
		{
			content: 'parent 1',
			expanded: true,
			children: [
				{
					content: 'parent 1-0',
					expanded: true,
					disabled: true,
					children: [
						{
							disabled: true,
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
	];

	return <Tree nodes={nodes} checkable={true} />;
});
