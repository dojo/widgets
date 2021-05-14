import { create, tsx } from '@dojo/framework/core/vdom';

import Example from '../../Example';
import HStack from '@dojo/widgets/hstack/HStack';
import Spacer from '@dojo/widgets/spacer/Spacer';
import TextInput from '@dojo/widgets/text-input';

const factory = create({});

export default factory(function Spacing() {
	return (
		<Example>
			<div styles={{ border: '1px black solid' }}>
				<div>Default</div>
				<HStack>
					<TextInput />
				</HStack>
				<div>Left</div>
				<HStack>
					<TextInput />
					<Spacer />
				</HStack>
				<div>Right</div>
				<HStack>
					<Spacer />
					<TextInput />
				</HStack>
				<div>Stretched</div>
				<HStack>
					<Spacer>
						<TextInput />
					</Spacer>
				</HStack>
				<div>Equal Sizing</div>
				<HStack>
					<Spacer>
						<TextInput />
					</Spacer>
					<Spacer>
						<TextInput />
					</Spacer>
					<Spacer>
						<TextInput />
					</Spacer>
					<Spacer>
						<TextInput />
					</Spacer>
					<Spacer>
						<TextInput />
					</Spacer>
				</HStack>
			</div>
		</Example>
	);
});
