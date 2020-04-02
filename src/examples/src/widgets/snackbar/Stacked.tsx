import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';

const factory = create();

export default factory(function Stacked() {
	return (
		<Snackbar stacked open={true}>
			{{
				message: 'Stacked Snackbar',
				actions: 'A really long actions renderer'
			}}
		</Snackbar>
	);
});
