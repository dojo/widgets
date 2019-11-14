import { create, tsx } from '@dojo/framework/core/vdom';
import ConstrainedInput from '@dojo/widgets/constrained-input';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const value = icache.getOrSet('value', '');

	return (
		<ConstrainedInput
			rules={{
				length: {
					min: 4,
					max: 16
				},
				contains: {
					numbers: 1
				}
			}}
			value={value}
			onValue={(value) => icache.set('value', value)}
			label="Enter Username"
		/>
	);
});
