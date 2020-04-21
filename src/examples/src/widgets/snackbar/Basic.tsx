import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<Snackbar open={true}>
				{{
					message: 'Basic Snackbar'
				}}
			</Snackbar>
		</Example>
	);
});
