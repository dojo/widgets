import { create, tsx } from '@dojo/framework/core/vdom';
import Rate from '@dojo/widgets/rate';
import Example from '../../Example';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	const value = icache.getOrSet('value', 0);

	return (
		<Example>
			<Rate
				value={value}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Controlled rating'
				}}
			</Rate>
		</Example>
	);
});
