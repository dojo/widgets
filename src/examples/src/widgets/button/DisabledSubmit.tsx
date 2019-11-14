import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function DisabledSubmitButton() {
	return (
		<Button type="submit" disabled>
			Submit
		</Button>
	);
});
