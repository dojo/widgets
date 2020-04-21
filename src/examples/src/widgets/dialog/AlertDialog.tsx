import { create, tsx } from '@dojo/framework/core/vdom';
import Dialog from '@dojo/widgets/dialog';
import Button from '@dojo/widgets/button';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function AlertDialog({ middleware: { icache } }) {
	const isOpen = icache.getOrSet<boolean>('isOpen', false);
	return (
		<Example>
			<div>
				<Button onClick={() => icache.set('isOpen', !isOpen)}>
					{`${isOpen ? 'Close' : 'Open'} Dialog`}
				</Button>
				<Dialog
					open={isOpen}
					onRequestClose={() => icache.set('isOpen', false)}
					role="alertdialog"
				>
					{{
						title: 'Alert Dialog',
						content: (
							<virtual>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id
								purus ipsum. Aenean ac purus purus. Nam sollicitudin varius augue,
								sed lacinia felis tempor in!
							</virtual>
						)
					}}
				</Dialog>
			</div>
		</Example>
	);
});
