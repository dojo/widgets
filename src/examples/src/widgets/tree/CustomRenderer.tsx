import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import Tree, { TreeNodeOption } from '@dojo/widgets/tree';
import Icon from '@dojo/widgets/icon';
import Example from '../../Example';

const resource = createResourceMiddleware();
const factory = create({ resource });
const nodes: TreeNodeOption[] = [
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
const template = createMemoryResourceTemplate<TreeNodeOption>();

export default factory(function CustomIcons({ id, middleware: { resource } }) {
	return (
		<Example>
			<Tree resource={resource({ template, initOptions: { id, data: nodes } })}>
				{(node) => (
					<div styles={{ display: 'flex' }}>
						<div styles={{ marginRight: '5px' }}>
							<Icon type="alertIcon" />
						</div>
						<div>{node.value}</div>
					</div>
				)}
			</Tree>
		</Example>
	);
});
