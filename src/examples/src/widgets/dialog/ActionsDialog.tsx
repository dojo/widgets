import icache from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import Dialog, { Action } from '@dojo/widgets/dialog';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function ActionsDialog({ middleware: { icache } }) {
	const isOpen = icache.getOrSet<boolean>('isOpen', false);
	return (
		<Example>
			<div>
				<Button onClick={() => icache.set('isOpen', !isOpen)}>
					{`${isOpen ? 'Close' : 'Open'} Dialog`}
				</Button>
				<Dialog open={isOpen} onRequestClose={() => icache.set('isOpen', false)}>
					{{
						title: 'Dialog with Actions',
						content: (
							<virtual>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id
								purus ipsum. Aenean ac purus purus. Nam sollicitudin varius augue,
								sed lacinia felis tempor in.
							</virtual>
						),
						actions: (
							<virtual>
								<Action onClick={() => icache.set('isOpen', false)}>OK</Action>
							</virtual>
						)
					}}
				</Dialog>
			</div>
		</Example>
	);
});
