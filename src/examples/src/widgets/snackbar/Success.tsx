import { create, tsx } from '@dojo/framework/core/vdom';
import Snackbar from '@dojo/widgets/snackbar';

const factory = create();

export default factory(function Success() {
	return <Snackbar type="success" open={true} messageRenderer={() => 'Success Snackbar'} />;
});
