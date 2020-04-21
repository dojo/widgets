import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';
import Example from '../../Example';

const factory = create();

export default factory(function Error() {
	return (
		<Example>
			<Snackbar type="error" open={true}>
				{{
					message: 'Error Snackbar'
				}}
			</Snackbar>
		</Example>
	);
});
