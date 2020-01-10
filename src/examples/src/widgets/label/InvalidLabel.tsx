import { create, tsx } from '@dojo/framework/core/vdom';
import Label from '@dojo/widgets/label';

const factory = create();

export default factory(function InvalidHidden() {
	return <Label valid={false}>Invalid Label</Label>;
});
