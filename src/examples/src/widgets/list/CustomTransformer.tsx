import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';
import { customDataTemplate } from '../../template';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

export default factory(function CustomTransformer({ middleware: { icache, resource } }) {
	const options = resource.createOptions((curr, next) => ({ ...curr, size: 5, ...next }));
	return (
		<Example>
			<List
				resource={resource({
					template: customDataTemplate,
					transform: { value: 'id', label: 'product' },
					options
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
