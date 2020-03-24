import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const options = [{ value: 'Save' }, { value: 'Copy' }, { value: 'Paste' }];

	return (
		<virtual>
			<List
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
