import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TextInput from '@dojo/widgets/text-input';
import Button from '@dojo/widgets/button';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	return (
		<Example>
			<div>
				<TextInput
					value={icache.getOrSet('value', '')}
					onValue={(value) => {
						icache.set('value', value);
					}}
				>
					{{ label: 'Controlled input with reset' }}
				</TextInput>
				<Button
					onClick={() => {
						icache.set('value', '');
					}}
				>
					Reset input
				</Button>
			</div>
			<div>The value text input is: "{icache.getOrSet('value', '')}"</div>
		</Example>
	);
});
