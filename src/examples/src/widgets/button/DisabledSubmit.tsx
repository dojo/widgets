import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import Example from '../../Example';

const factory = create();

export default factory(function DisabledSubmitButton() {
	return (
		<Example>
			<Button type="submit" disabled>
				Submit
			</Button>
		</Example>
	);
});
