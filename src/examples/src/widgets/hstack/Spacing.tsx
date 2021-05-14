import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import Example from '../../Example';
import HStack from '@dojo/widgets/hstack/HStack';
import RadioGroup from '@dojo/widgets/radio-group';

const factory = create({ icache });

export default factory(function Spacing({ middleware: { icache } }) {
	const value = icache.getOrSet('spacing', 'none');
	return (
		<Example>
			<div>
				<RadioGroup
					value={value}
					name="spacing"
					onValue={(value) => {
						icache.set('spacing', value);
					}}
					options={[
						{ value: 'none' },
						{ value: 'extra-small' },
						{ value: 'small' },
						{ value: 'medium' },
						{ value: 'large' },
						{ value: 'extra-large' }
					]}
				/>
				<div styles={{ border: '1px black solid', height: '400px' }}>
					<HStack spacing={value}>
						<div>HELLO</div>
						<div>I</div>
						<div>AM</div>
						<div>IN</div>
						<div>A</div>
						<div>STACK</div>
					</HStack>
				</div>
			</div>
		</Example>
	);
});
