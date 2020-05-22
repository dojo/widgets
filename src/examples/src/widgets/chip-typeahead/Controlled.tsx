import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Icon from '@dojo/widgets/icon';
import Example from '../../Example';
import { createMemoryResourceTemplate, createResourceMiddleware } from '@dojo/widgets/resources';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ resource, icache });
const options = [
	{ value: 'cat', label: 'Cat' },
	{ value: 'dog', label: 'Dog' },
	{ value: 'fish', label: 'Fish' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Controlled({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<ChipTypeahead
				resource={resource({ template, initOptions: { id, data: options } })}
				value={icache.getOrSet('value', [])}
				onValue={(value) => icache.set('value', value)}
			>
				{{
					label: 'Chip Typeahead'
				}}
			</ChipTypeahead>
			<br />
			<div>
				The selected values are:
				<ul>
					{icache.getOrSet('value', []).map((value, index) => (
						<li key={value}>
							<a
								href="#"
								onclick={(event) => {
									event.preventDefault();
									const value = icache.getOrSet('value', []);
									value.splice(index, 1);
									icache.set('value', value);
								}}
							>
								{value} <Icon type="closeIcon" />
							</a>
						</li>
					))}
				</ul>
			</div>
		</Example>
	);
});
