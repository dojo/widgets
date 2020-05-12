import { create, tsx } from '@dojo/framework/core/vdom';
import Tree from '@dojo/widgets/tree';

const factory = create();

export default factory(function Advanced() {
	const nodes = [
		{
			title: 'parent 1',
			expanded: true,
			children: [
				{
					title: 'parent 1-0',
					expanded: true,
					children: [
						{
							title: 'leaf'
						},
						{
							title: 'leaf'
						}
					]
				},
				{
					title: 'parent 1-1',
					expanded: true,
					children: [
						{
							title: 'sss'
						}
					]
				}
			]
		}
	];

	return <Tree nodes={nodes} />;
});
