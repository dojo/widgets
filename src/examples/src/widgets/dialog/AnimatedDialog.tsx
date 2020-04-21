import { create, tsx } from '@dojo/framework/core/vdom';
import Dialog from '@dojo/widgets/dialog';
import Button from '@dojo/widgets/button';
import icache from '@dojo/framework/core/middleware/icache';
import theme from '@dojo/widgets/middleware/theme';
import * as css from './styles/AnimatedDialog.m.css';
import Example from '../../Example';

const factory = create({ icache, theme });

export default factory(function AnimatedDialog({ middleware: { icache, theme } }) {
	const isOpen = icache.getOrSet<boolean>('isOpen', false);
	const { enter, exit } = theme.classes(css);

	return (
		<Example>
			<div>
				<Button onClick={() => icache.set('isOpen', !isOpen)}>
					{`${isOpen ? 'Close' : 'Open'} Dialog`}
				</Button>
				<Dialog
					open={isOpen}
					onRequestClose={() => icache.set('isOpen', false)}
					classes={{
						'@dojo/widgets/dialog': {
							enter: [enter],
							exit: [exit]
						}
					}}
				>
					{{
						title: 'Basic Dialog',
						content: (
							<virtual>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id
								purus ipsum. Aenean ac purus purus. Nam sollicitudin varius augue,
								sed lacinia felis tempor in.
							</virtual>
						)
					}}
				</Dialog>
			</div>
		</Example>
	);
});
