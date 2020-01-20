import { create, tsx } from '@dojo/framework/core/vdom';
import EmailInput from '@dojo/widgets/email-input';

const factory = create();

const Example = factory(function() {
	return <EmailInput />;
});

export default Example;
