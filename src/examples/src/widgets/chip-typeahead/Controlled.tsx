import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Icon from '@dojo/widgets/icon';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { data, Data } from '../../data';
import { ListOption } from '@dojo/widgets/list';

const icache = createICacheMiddleware<{ value: ListOption[] }>();
const resource = createResourceMiddleware();
const factory = create({ resource, icache });

const template = createMemoryResourceTemplate<Data>();

export default factory(function Controlled({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<ChipTypeahead
				resource={resource({
					template,
					transform: { value: 'id', label: 'product' },
					initOptions: { id, data }
				})}
				value={icache.getOrSet('value', []).map((value) => value.value)}
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
						<li key={value.value}>
							<a
								href="#"
								onclick={(event) => {
									event.preventDefault();
									const value = icache.getOrSet('value', []);
									value.splice(index, 1);
									icache.set('value', value);
								}}
							>
								{value.label} <Icon type="closeIcon" />
							</a>
						</li>
					))}
				</ul>
			</div>
		</Example>
	);
});
