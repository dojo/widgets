import { create, tsx } from '@dojo/framework/core/vdom';
import EmailInput from '@dojo/widgets/email-input';
import Example from '../../Example';

const factory = create();

export default factory(function() {
	return (
		<Example>
			<EmailInput />
		</Example>
	);
});
