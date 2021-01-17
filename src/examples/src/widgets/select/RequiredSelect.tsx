import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

const template = createResourceTemplate<{ value: string }>('value');

export default factory(function RequiredSelect({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<Select
				resource={resource({
					template: template({ id, data: options }),
					transform: { value: 'value', label: 'value' }
				})}
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
			<pre>{`Value: ${JSON.stringify(icache.getOrSet('value', ''))}, Valid: ${icache.get(
				'valid'
			)}`}</pre>
		</Example>
	);
});
