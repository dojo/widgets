import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextInput from '@dojo/widgets/text-input';

const factory = create({ icache });

const Example = factory(function({ middleware: { icache } }) {
	return (
		<virtual>
			<TextInput
				initialValue="Hello, Dojo!"
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<div>The value text input is: "{icache.getOrSet('value', '')}"</div>
		</virtual>
	);
});

export default Example;
