import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';
import Example from '../../Example';
import ActionButton from '@dojo/widgets/action-button';

const factory = create();

export default factory(function Stacked() {
	return (
		<Example>
			<Snackbar stacked open={true}>
				{{
					message: 'Stacked Snackbar',
					actions: <ActionButton>Some Action</ActionButton>
				}}
			</Snackbar>
		</Example>
	);
});
