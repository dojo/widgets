import { create, tsx } from '@dojo/framework/core/vdom';
import Menu, { MenuOption } from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const options: MenuOption[] = [];
const total = 100000;
for (let i = 0; i < total; i++) {
	options[i] = { value: `test-${i}` };
}

export default factory(function LargeOptionSet({ middleware: { icache } }) {
	return (
		<virtual>
			<Menu
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
				total={total}
				itemsInView={10}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
