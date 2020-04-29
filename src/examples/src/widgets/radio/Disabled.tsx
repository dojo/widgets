import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';
import Example from '../../Example';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Example>
			<div>
				<Radio
					checked={false}
					disabled
					onValue={(checked) => icache.set('example-one', checked)}
				/>
				<Radio checked disabled onValue={(checked) => icache.set('example-two', checked)} />
			</div>
		</Example>
	);
});
