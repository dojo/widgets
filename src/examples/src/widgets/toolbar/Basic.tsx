import { create, tsx } from '@dojo/framework/core/vdom';
import Toolbar from '@dojo/widgets/toolbar';

const factory = create();

export default factory(function Basic() {
	return (
		<Toolbar>
			<a href="#item">Menu</a>
		</Toolbar>
	);
});
