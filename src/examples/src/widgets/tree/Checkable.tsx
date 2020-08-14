import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import Tree, { TreeNodeOption } from '@dojo/widgets/tree';
import Example from '../../Example';

const resource = createResourceMiddleware();
const factory = create({ resource });
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

export default factory(function Checkable({ id, middleware: { resource } }) {
	return (
		<Example>
			<Tree
				checkable={true}
				resource={resource({ template, initOptions: { id, data: nodes } })}
			/>
		</Example>
	);
});
