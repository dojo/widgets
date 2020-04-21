import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';
import Example from '../../Example';

const factory = create();

export default factory(function Success() {
	return (
		<Example>
			<Snackbar type="success" open={true}>
				{{
					message: 'Success Snackbar'
				}}
			</Snackbar>
		</Example>
	);
});
