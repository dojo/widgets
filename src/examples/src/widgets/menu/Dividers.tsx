import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Dividers({ middleware: { icache } }) {
	const options = [
		{ value: 'Save' },
		{ value: 'Delete', divider: true },
		{ value: 'copy', label: 'Copy' },
		{ value: 'Paste', disabled: true, divider: true },
		{ value: 'Edit' }
	];

	return (
		<virtual>
			<Menu
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
				total={options.length}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
