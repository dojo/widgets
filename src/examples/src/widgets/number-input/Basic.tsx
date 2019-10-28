import { create, tsx } from '@dojo/framework/core/vdom';
import NumberInput from '@dojo/widgets/number-input';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const Example = factory(function Example({ middleware: { icache } }) {
	const value = icache.getOrSet<number>('value', 42);
	return (
		<NumberInput
			value={value}
			onValue={(value) => {
				icache.set('value', value);
			}}
		/>
	);
});

export default Example;
