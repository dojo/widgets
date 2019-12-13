import { create, tsx } from '@dojo/framework/core/vdom';
import Menu, { MenuOption } from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const options: MenuOption[] = [];
	const total = 10000;
	for (let i = 0; i < total; i++) {
		options[i] = { value: `test-${i}` };
	}

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
