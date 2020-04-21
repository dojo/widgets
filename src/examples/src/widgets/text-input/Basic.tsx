import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextInput from '@dojo/widgets/text-input';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function({ middleware: { icache } }) {
	return (
		<Example>
			<TextInput
				initialValue="Hello, Dojo!"
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<div>The value text input is: "{icache.getOrSet('value', '')}"</div>
		</Example>
	);
});
