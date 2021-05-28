import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import Example from '../../Example';

const factory = create();

export default factory(function TextButton() {
	return (
		<Example>
			<Button kind="text">Text Button</Button>
		</Example>
	);
});
