import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Tooltip from '@dojo/widgets/tooltip';
import TextInput from '@dojo/widgets/text-input';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const show = icache.getOrSet('show', false);
	return (
		<Example>
			<Tooltip open={show}>
				{{
					content: 'This tooltip shows on focus',
					trigger: (
						<TextInput
							onFocus={() => {
								icache.set('show', true);
							}}
							onBlur={() => {
								icache.set('show', false);
							}}
						>
							{{ label: 'Focus me' }}
						</TextInput>
					)
				}}
			</Tooltip>
		</Example>
	);
});
