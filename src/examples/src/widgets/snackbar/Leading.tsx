import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';

const factory = create();

export default factory(function Leading() {
	return (
		<Snackbar leading open={true}>
			{{
				message: 'Leading Snackbar'
			}}
		</Snackbar>
	);
});
