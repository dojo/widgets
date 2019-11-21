import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const options = [
		{ value: 'Save' },
		{ value: 'copy', label: 'Copy' },
		{ value: 'Paste', disabled: true }
	];

	return (
		<virtual>
			<Menu
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
