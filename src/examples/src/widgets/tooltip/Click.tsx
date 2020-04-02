import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Tooltip from '@dojo/widgets/tooltip';
import Button from '@dojo/widgets/button';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const show = icache.getOrSet('show', false);
	return (
		<Tooltip open={show}>
			{{
				content: 'This tooltip is toggled on click',
				target: (
					<Button
						onClick={() => {
							icache.set('show', !icache.get<boolean>('show'));
						}}
					>
						Click Me
					</Button>
				)
			}}
		</Tooltip>
	);
});
