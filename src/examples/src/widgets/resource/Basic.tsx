import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListOption } from '@dojo/widgets/list';
import Resource from '@dojo/widgets/resource';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createMemoryResourceTemplate } from '@dojo/framework/core/middleware/resources';

const factory = create({ icache });

const animals = [{ value: 'cat' }, { value: 'dog' }, { value: 'mouse' }, { value: 'rat' }];
const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Basic({ id, middleware: { icache } }) {
	const ResourcelessList = List as any;
	return (
		<Example>
			<Resource initOptions={{ id, data: animals }} template={template}>
				<ResourcelessList
					onValue={(value: string) => {
						icache.set('value', value);
					}}
				/>
			</Resource>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
