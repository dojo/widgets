import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Typeahead from '@dojo/widgets/typeahead';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const options = [
	{ value: '2', label: 'Dog' },
	{ value: '3', label: 'Fish' },
	{ value: '5', label: 'Catfish' },
	{ value: '4', label: 'Cat' }
];

const template = createResourceTemplate<ListOption>('value');

export default factory(function FreeText({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<Typeahead
				required={true}
				strict={false}
				resource={resource({ template: template({ id, data: options }) })}
				onValidate={(valid) => {
					icache.set('valid', valid);
				}}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Basic Typeahead'
				}}
			</Typeahead>
			<div>
				<div>
					<span>Value: </span>
					<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
				</div>
				<div>{`Valid: ${icache.getOrSet('valid', 'not set')}`}</div>
			</div>
		</Example>
	);
});
