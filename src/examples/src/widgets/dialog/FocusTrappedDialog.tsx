import { create, tsx } from '@dojo/framework/core/vdom';
import Dialog from '@dojo/widgets/dialog';
import Button from '@dojo/widgets/button';
import icache from '@dojo/framework/core/middleware/icache';
import TextInput from '@dojo/widgets/text-input';

const factory = create({ icache });

export default factory(function FocusTrappedDialog({ middleware: { icache } }) {
	const isOpen = icache.getOrSet<boolean>('isOpen', false);
	return (
		<div>
			<Button onClick={() => icache.set('isOpen', !isOpen)}>
				{`${isOpen ? 'Close' : 'Open'} Dialog`}
			</Button>
			<Dialog open={isOpen} onRequestClose={() => icache.set('isOpen', false)}>
				{{
					title: () => 'Focus Trapped Dialog',
					content: () => (
						<virtual>
							<TextInput label="First Name" key="first" />
							<TextInput label="Last Name" key="last" />
						</virtual>
					)
				}}
			</Dialog>
		</div>
	);
});
