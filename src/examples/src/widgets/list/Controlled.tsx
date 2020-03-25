import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource } from '@dojo/framework/core/resource';
import { createMemoryTemplate } from './memoryTemplate';

const factory = create({ icache });
const memoryTemplate = createMemoryTemplate();

const states = [
	{ value: 'Alabama' },
	{ value: 'Alaska' },
	{ value: 'Arizona', disabled: true },
	{ value: 'Arkansas' },
	{ value: 'California' },
	{ value: 'Colorado' },
	{ value: 'Connecticut' },
	{ value: 'Delaware' },
	{ value: 'Florida' },
	{ value: 'Georgia', disabled: true },
	{ value: 'Hawaii' },
	{ value: 'Idaho' },
	{ value: 'Illinois' },
	{ value: 'Indiana' },
	{ value: 'Iowa' },
	{ value: 'Kansas' },
	{ value: 'Kentucky' },
	{ value: 'Louisiana', disabled: true },
	{ value: 'Maine' },
	{ value: 'Maryland' },
	{ value: 'Massachusetts' },
	{ value: 'Michigan' },
	{ value: 'Minnesota', disabled: true },
	{ value: 'Mississippi' },
	{ value: 'Missouri' },
	{ value: 'Montana' },
	{ value: 'Nebraska' },
	{ value: 'Nevada' },
	{ value: 'New Hampshire' },
	{ value: 'New Jersey' },
	{ value: 'New Mexico' },
	{ value: 'New York' },
	{ value: 'North Carolina' },
	{ value: 'North Dakota', disabled: true },
	{ value: 'Ohio' },
	{ value: 'Oklahoma', disabled: true },
	{ value: 'Oregon' },
	{ value: 'Pennsylvania' },
	{ value: 'Rhode Island' },
	{ value: 'South Carolina' },
	{ value: 'South Dakota' },
	{ value: 'Tennessee' },
	{ value: 'Texas' },
	{ value: 'Utah' },
	{ value: 'Vermont' },
	{ value: 'Virginia' },
	{ value: 'Washington' },
	{ value: 'West Virginia', disabled: true },
	{ value: 'Wisconsin' },
	{ value: 'Wyoming' }
];

export default factory(function Controlled({ middleware: { icache } }) {
	const activeIndex = icache.getOrSet('activeIndex', 0);

	return (
		<virtual>
			<button
				type="button"
				onclick={() => {
					icache.set('activeIndex', (activeIndex - 1 + states.length) % states.length);
				}}
			>
				UP
			</button>
			<button
				type="button"
				onclick={() => {
					icache.set('activeIndex', (activeIndex + 1) % states.length);
				}}
			>
				DOWN
			</button>
			<button
				type="button"
				onclick={() => {
					const activeIndex = icache.get<number>('activeIndex');
					if (activeIndex) {
						const item = states[activeIndex];
						!item.disabled && icache.set('value', states[activeIndex].value);
					}
				}}
			>
				SELECT
			</button>
			<List
				focusable={false}
				itemsInView={4}
				resource={{
					resource: () => createResource(memoryTemplate),
					data: states
				}}
				transform={defaultTransform}
				onActiveIndexChange={(index: number) => {
					icache.set('activeIndex', index);
				}}
				activeIndex={activeIndex}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
