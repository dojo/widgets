import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';
import Example from '../../Example';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function Stacked() {
	return (
		<Example>
			<Snackbar stacked open={true}>
				{{
					message: 'Stacked Snackbar',
					actions: <Button>Some Action</Button>
				}}
			</Snackbar>
		</Example>
	);
});
