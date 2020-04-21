import { create, tsx } from '@dojo/framework/core/vdom';
import Dialog from '@dojo/widgets/dialog';
import Button from '@dojo/widgets/button';
import icache from '@dojo/framework/core/middleware/icache';
import TextInput from '@dojo/widgets/text-input';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function FocusTrappedDialog({ middleware: { icache } }) {
	const isOpen = icache.getOrSet<boolean>('isOpen', false);
	return (
		<Example>
			<div>
				<Button onClick={() => icache.set('isOpen', !isOpen)}>
					{`${isOpen ? 'Close' : 'Open'} Dialog`}
				</Button>
				<Dialog open={isOpen} onRequestClose={() => icache.set('isOpen', false)}>
					{{
						title: 'Focus Trapped Dialog',
						content: (
							<virtual>
								<TextInput key="first">{{ label: 'First Name' }}</TextInput>
								<TextInput key="last">{{ label: 'Last Name' }}</TextInput>
							</virtual>
						)
					}}
				</Dialog>
			</div>
		</Example>
	);
});
