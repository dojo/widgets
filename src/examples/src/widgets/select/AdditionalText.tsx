import { create, tsx } from '@dojo/framework/core/vdom';
import Select, { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createResource } from '@dojo/framework/core/resource';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

const resource = createResource();

export default factory(function AdditionalText({ middleware: { icache } }) {
	return (
		<Example>
			<Select
				resource={resource(options)}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
				helperText="I am the helper text"
				placeholder="I am a placeholder"
			>
				{{
					label: 'Additional Text'
				}}
			</Select>
			<pre>{`Value: ${icache.getOrSet('value', '')}`}</pre>
		</Example>
	);
});
