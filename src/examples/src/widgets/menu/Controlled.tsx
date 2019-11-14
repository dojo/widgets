import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu/Menu';
import icache from '@dojo/framework/core/middleware/icache';
import states from './states';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	const activeIndex = icache.getOrSet<number>('activeIndex', 0);

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
			<Menu
				focusable={false}
				numberInView={6}
				options={states}
				onActiveIndexChange={(index: number) => {
					icache.set('activeIndex', index);
				}}
				activeIndex={activeIndex}
				onValue={(value) => {
					console.log(`selected: ${value}`);
				}}
			/>
		</virtual>
	);
});
