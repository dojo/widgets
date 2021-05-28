import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Text from '@dojo/widgets/text';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Inverse() {
	return (
		<Example>
			<div styles={{ background: 'black' }}>
				<Text inverse>Inverse Primary Text Color</Text>
			</div>
		</Example>
	);
});
