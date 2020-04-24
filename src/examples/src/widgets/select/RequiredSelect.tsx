import { create, tsx } from '@dojo/framework/core/vdom';
import Select, { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource } from '@dojo/framework/core/resource';
import Example from '../../Example';
import { ListOption } from '@dojo/widgets/list';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

const resource = createResource<ListOption>();

export default factory(function RequiredSelect({ middleware: { icache } }) {
	return (
		<Example>
			<Select
				resource={resource(options)}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
				required
				onValidate={(valid) => {
					icache.set('valid', valid);
				}}
			>
				{{
					label: 'Required Select'
				}}
			</Select>
			<pre>{`Value: ${icache.getOrSet('value', '')}, Valid: ${icache.get('valid')}`}</pre>
		</Example>
	);
});
