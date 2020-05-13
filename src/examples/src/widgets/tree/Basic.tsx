import { create, tsx } from '@dojo/framework/core/vdom';
import Tree from '@dojo/widgets/tree';

const factory = create();

export default factory(function Basic() {
	const nodes = [
		{
			content: 'parent 1',
			expanded: true,
			children: [
				{
					content: 'parent 1-0',
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
					children: [
						{
							content: 'leaf'
						}
					]
				}
			]
		}
	];

	return <Tree nodes={nodes} />;
});
