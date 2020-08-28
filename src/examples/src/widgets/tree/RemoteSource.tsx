import { create, tsx } from '@dojo/framework/core/vdom';
import {
	createResourceMiddleware,
	defaultFind,
	createResourceTemplate
} from '@dojo/framework/core/middleware/resources';
import Example from '../../Example';
import Tree, { TreeNodeOption } from '@dojo/widgets/tree';

const template = createResourceTemplate<TreeNodeOption>({
	find: defaultFind,
	read: async (request, { put, get }) => {
		const { query } = request;
		const response = await fetch(`https://foamy-picayune-lamprey.glitch.me/${query.parent}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const { data, total } = await response.json();

		put({ data, total }, request);
	}
});

const resource = createResourceMiddleware();
const factory = create({ resource });

export default factory(function Remote({ id, middleware: { resource } }) {
	return (
		<Example>
			<Tree
				checkable={true}
				resource={resource({
					template
				})}
			/>
		</Example>
	);
});
