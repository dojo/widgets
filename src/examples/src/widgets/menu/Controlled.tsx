import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';
import states from './states';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	const activeIndex = icache.getOrSet('activeIndex', 0);
	const initialValue = icache.get<string>('initialValue');

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
						!item.disabled && icache.set('initialValue', states[activeIndex].value);
					}
				}}
			>
				SELECT
			</button>
			<Menu
				focusable={false}
				itemsInView={6}
				options={states}
				onActiveIndexChange={(index: number) => {
					icache.set('activeIndex', index);
				}}
				activeIndex={activeIndex}
				onValue={(value) => {
					icache.set('value', value);
				}}
				initialValue={initialValue}
			/>
			<p>{`Selected: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
