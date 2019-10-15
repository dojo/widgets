import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function Basic() {
	return <Button>Button</Button>;
});
