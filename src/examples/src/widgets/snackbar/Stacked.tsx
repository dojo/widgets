import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar, { Action } from '@dojo/widgets/snackbar';
import Example from '../../Example';

const factory = create();

export default factory(function Stacked() {
	return (
		<Example>
			<Snackbar stacked open={true}>
				{{
					message: 'Stacked Snackbar',
					actions: <Action>Some Action</Action>
				}}
			</Snackbar>
		</Example>
	);
});
