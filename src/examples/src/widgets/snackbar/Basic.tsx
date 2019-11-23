import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';

const factory = create();

export default factory(function Basic() {
	return <Snackbar open={true} messageRenderer={() => 'Basic Snackbar'} />;
});
