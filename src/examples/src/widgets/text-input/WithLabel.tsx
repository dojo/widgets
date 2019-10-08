import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';

const factory = create();

const Example = factory(function() {
	return (
		<div>
			<TextInput label="basic 2" />
		</div>
	);
});

export default Example;
