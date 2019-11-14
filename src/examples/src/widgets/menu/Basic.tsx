import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu/Menu';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const animalOptions = [
		{ value: 'dog' },
		{ value: 'cat', label: 'Cat' },
		{ value: 'fish', disabled: true }
	];

	return (
		<virtual>
			<Menu
				options={animalOptions}
				initialValue={'cat'}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Selected: ${icache.getOrSet<string>('value', '')}`}</p>{' '}
		</virtual>
	);
});
