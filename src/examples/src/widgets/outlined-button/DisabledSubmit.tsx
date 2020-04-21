import { create, tsx } from '@dojo/framework/core/vdom';
import OutlinedButton from '@dojo/widgets/outlined-button';
import Example from '../../Example';

const factory = create();

export default factory(function DisabledSubmitButton() {
	return (
		<Example>
			<OutlinedButton type="submit" disabled>
				Submit
			</OutlinedButton>
		</Example>
	);
});
