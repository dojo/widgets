import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Text from '@dojo/widgets/text';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Size() {
	return (
		<Example>
			<virtual>
				<Text size="xs">Extra Small Text</Text>
				<Text size="s">Small Text</Text>
				<Text size="m">Medium Text (default)</Text>
				<Text size="l">Large Text</Text>
				<Text size="xl">Extra Large Text</Text>
				<Text size="xxl">Extra Extra Large Text</Text>
			</virtual>
		</Example>
	);
});
