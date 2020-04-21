import { create, tsx } from '@dojo/framework/core/vdom';
import TextArea from '@dojo/widgets/text-area';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	return (
		<Example>
			<TextArea
				value={icache.getOrSet('value', '')}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
		</Example>
	);
});
