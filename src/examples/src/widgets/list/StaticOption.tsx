import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { listOptionTemplate } from '../../template';

const factory = create({ icache });

export default factory(function StaticOption({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={{ template: listOptionTemplate }}
				onValue={(value) => {
					icache.set('value', value);
				}}
				staticOption={{ value: 'static', label: 'This is a static option' }}
			/>
			<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
