import { create, tsx } from '@dojo/framework/core/vdom';
import Label from '@dojo/widgets/label';
import Example from '../../Example';

const factory = create();

export default factory(function InvalidHidden() {
	return (
		<Example>
			<Label valid={false}>Invalid Label</Label>
		</Example>
	);
});
