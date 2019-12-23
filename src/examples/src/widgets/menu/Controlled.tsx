import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	const activeIndex = icache.getOrSet('activeIndex', 0);

	const options = [
		{ value: 'Save' },
		{ value: 'copy', label: 'Copy' },
		{ value: 'Paste', disabled: true },
		{ value: 'Print' },
		{ value: 'Export' },
		{ value: 'Share' }
	];

	return (
		<virtual>
			<button
				type="button"
				onclick={() => {
					icache.set('activeIndex', (activeIndex - 1 + options.length) % options.length);
				}}
			>
				UP
			</button>
			<button
				type="button"
				onclick={() => {
					icache.set('activeIndex', (activeIndex + 1) % options.length);
				}}
			>
				DOWN
			</button>
			<button
				type="button"
				onclick={() => {
					const activeIndex = icache.get<number>('activeIndex');
					if (activeIndex) {
						const item = options[activeIndex];
						!item.disabled && icache.set('value', options[activeIndex].value);
					}
				}}
			>
				SELECT
			</button>
			<Menu
				focusable={false}
				itemsInView={4}
				options={options}
				onActiveIndexChange={(index: number) => {
					icache.set('activeIndex', index);
				}}
				activeIndex={activeIndex}
				onValue={(value) => {
					icache.set('value', value);
				}}
				total={options.length}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
