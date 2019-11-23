import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';
import icache from '@dojo/framework/core/middleware/icache';
import Button from '@dojo/widgets/button';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const open = icache.getOrSet('open', true);
	return (
		<Snackbar
			open={open}
			messageRenderer={() => 'Snackbar'}
			actionsRenderer={() => (
				<Button onClick={() => icache.set('open', false)}>Dismiss</Button>
			)}
		/>
	);
});
