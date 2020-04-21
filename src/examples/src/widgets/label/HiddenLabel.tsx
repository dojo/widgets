import { create, tsx } from '@dojo/framework/core/vdom';
import Label from '@dojo/widgets/label';
import Example from '../../Example';

const factory = create();

export default factory(function HiddenLabel() {
	return (
		<Example>
			<Label hidden={true}>Hidden Label</Label>
		</Example>
	);
});
