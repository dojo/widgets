import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';

const factory = create();

export default factory(function Error() {
	return (
		<Snackbar type="error" open={true}>
			{{
				message: 'Error Snackbar'
			}}
		</Snackbar>
	);
});
