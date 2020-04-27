import { create, tsx } from '@dojo/framework/core/vdom';
import Select, { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource } from '@dojo/framework/core/resource';
import Example from '../../Example';
import { ListOption } from '@dojo/widgets/list';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

const resource = createResource<ListOption>();

export default factory(function DisabledSelect() {
	return (
		<Example>
			<Select
				resource={resource(options)}
				transform={defaultTransform}
				disabled
				onValue={() => {}}
			>
				{{
					label: 'Disabled Select'
				}}
			</Select>
		</Example>
	);
});
