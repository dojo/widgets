import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Tooltip from '@dojo/widgets/tooltip';
import Button from '@dojo/widgets/button';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const show = icache.getOrSet('show', false);
	return (
		<Example>
			<Tooltip open={show}>
				{{
					content: 'This tooltip shows on mouseover',
					trigger: (
						<Button
							onOut={() => {
								icache.set('show', false);
							}}
							onOver={() => {
								icache.set('show', true);
							}}
						>
							Click
						</Button>
					)
				}}
			</Tooltip>
		</Example>
	);
});
