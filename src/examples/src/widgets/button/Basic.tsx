import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<Button>Basic Button</Button>
		</Example>
	);
});
