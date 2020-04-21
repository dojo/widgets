import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';
import Example from '../../Example';

const factory = create();

export default factory(function Leading() {
	return (
		<Example>
			<Snackbar leading open={true}>
				{{
					message: 'Leading Snackbar'
				}}
			</Snackbar>
		</Example>
	);
});
