import { create, tsx } from '@dojo/framework/core/vdom';

import Example from '../../Example';
import HStack from '@dojo/widgets/hstack/HStack';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div styles={{ border: '1px black solid', height: '400px', width: '400px' }}>
				<HStack>
					<div>Hello World</div>
				</HStack>
			</div>
		</Example>
	);
});
