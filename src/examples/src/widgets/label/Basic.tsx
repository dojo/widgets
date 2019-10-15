import { create, tsx } from '@dojo/framework/core/vdom';
import Label from '@dojo/widgets/label';

const factory = create();

export default factory(function Basic() {
	return <Label>Basic Label</Label>;
});
