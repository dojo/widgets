import { create, tsx } from '@dojo/framework/core/vdom';
import ConstrainedInput from '@dojo/widgets/constrained-input';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const value1 = icache.getOrSet('value1', '');
	const value2 = icache.getOrSet('value2', '');

	return (
		<virtual>
			<ConstrainedInput
				rules={{
					length: {
						min: 2,
						max: 8
					}
				}}
				value={value1}
				onValue={(value) => icache.set('value1', value)}
				label="Length"
			/>
			<ConstrainedInput
				rules={{
					contains: {
						atLeast: 2,
						uppercase: 1,
						specialCharacters: 1,
						numbers: 2
					}
				}}
				value={value2}
				onValue={(value) => icache.set('value2', value)}
				label="Contains"
			/>
		</virtual>
	);
});
