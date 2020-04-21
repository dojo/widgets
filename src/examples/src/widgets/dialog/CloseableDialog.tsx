import { create, tsx } from '@dojo/framework/core/vdom';
import Dialog from '@dojo/widgets/dialog';
import Button from '@dojo/widgets/button';
import Checkbox from '@dojo/widgets/checkbox';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function CloseableDialog({ middleware: { icache } }) {
	const isOpen = icache.getOrSet<boolean>('isOpen', false);
	const isCloseable = icache.getOrSet<boolean>('isCloseable', false);
	return (
		<Example>
			<div>
				<Button onClick={() => icache.set('isOpen', !isOpen)}>
					{`${isOpen ? 'Close' : 'Open'} Dialog`}
				</Button>
				<Dialog
					open={isOpen}
					closeable={isCloseable}
					onRequestClose={() => icache.set('isOpen', false)}
				>
					{{
						title: 'Closeable Dialog',
						content: (
							<virtual>
								<div>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
									id purus ipsum. Aenean ac purus purus. Nam sollicitudin varius
									augue, sed lacinia felis tempor in.
								</div>
								<Checkbox
									checked={isCloseable}
									onValue={(value) => icache.set('isCloseable', !isCloseable)}
								>
									Closeable?
								</Checkbox>
							</virtual>
						)
					}}
				</Dialog>
			</div>
		</Example>
	);
});
