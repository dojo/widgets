import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';

const factory = create();

export default factory(function Stacked() {
	return (
		<Snackbar
			stacked
			open={true}
			messageRenderer={() => 'Stacked Snackbar'}
			actionsRenderer={() => 'A really long actions renderer'}
		/>
	);
});
