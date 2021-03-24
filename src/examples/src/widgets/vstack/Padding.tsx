import { create, tsx } from '@dojo/framework/core/vdom';

import Example from '../../Example';
import VStack from '@dojo/widgets/stack/VStack';

const factory = create();

export default factory(function Padding() {
	return (
		<Example>
			<div styles={{ border: '1px black solid', height: '400px' }}>
				<VStack padding>
					<div>HELLO</div>
					<div>I</div>
					<div>AM</div>
					<div>IN</div>
					<div>A</div>
					<div>STACK</div>
				</VStack>
			</div>
		</Example>
	);
});
