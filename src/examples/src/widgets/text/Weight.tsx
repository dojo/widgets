import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Text from '@dojo/widgets/text';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Weight() {
	return (
		<Example>
			<virtual>
				<Text weight="light">Light Text</Text>
				<Text weight="normal">Normal Text (default)</Text>
				<Text weight="heavy">Heavy Text</Text>
			</virtual>
		</Example>
	);
});
