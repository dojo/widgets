import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Text from '@dojo/widgets/text';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Size() {
	return (
		<Example>
			<virtual>
				<Text size="x-small">Extra Small Text</Text>
				<Text size="small">Small Text</Text>
				<Text size="medium">Medium Text (default)</Text>
				<Text size="large">Large Text</Text>
				<Text size="x-large">Extra Large Text</Text>
				<Text size="xx-large">Extra Extra Large Text</Text>
			</virtual>
		</Example>
	);
});
