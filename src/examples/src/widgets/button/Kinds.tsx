import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import Example from '../../Example';

const factory = create();

export default factory(function Kinds() {
	return (
		<Example>
			<div>
				<Button kind="primary">Primary</Button>
				<br />
				<br />
				<Button kind="secondary">Secondary</Button>
				<br />
				<br />
				<Button kind="default">Default</Button>
			</div>
		</Example>
	);
});
