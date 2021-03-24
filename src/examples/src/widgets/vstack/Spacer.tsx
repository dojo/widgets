import { create, tsx } from '@dojo/framework/core/vdom';

import Example from '../../Example';
import VStack from '@dojo/widgets/stack/VStack';
import Spacer from '@dojo/widgets/stack/Spacer';
import TextInput from '@dojo/widgets/text-input';

const factory = create({});

export default factory(function Spacing() {
	return (
		<Example>
			<div styles={{ border: '1px black solid', height: '400px' }}>
				<VStack>
					<TextInput />
					<Spacer />
				</VStack>
			</div>
		</Example>
	);
});
