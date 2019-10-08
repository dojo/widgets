import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';

const factory = create();

const Example = factory(function() {
	return <Button>Button</Button>;
});

export default Example;
