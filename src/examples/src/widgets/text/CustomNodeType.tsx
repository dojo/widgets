import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Text from '@dojo/widgets/text';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function CustomNodeType() {
	return (
		<Example>
			<virtual>
				<Text as="h1">As Header</Text>
				<Text as="div">As div</Text>
			</virtual>
		</Example>
	);
});
