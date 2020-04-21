import { create, tsx } from '@dojo/framework/core/vdom';
import NumberInput from '@dojo/widgets/number-input';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const initialValue = 42;
	return (
		<Example>
			<NumberInput
				initialValue={initialValue}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<div>The number input value is: {`${icache.getOrSet('value', initialValue)}`}</div>
		</Example>
	);
});
