import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithData } from './memoryTemplate';
import states from './states';

const factory = create({ icache });
const resource = createMemoryResourceWithData(states);

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
				resource={resource}
				transform={defaultTransform}
				onActiveIndexChange={(index: number) => {
					icache.set('activeIndex', index);
				}}
				activeIndex={activeIndex}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</virtual>
	);
});
