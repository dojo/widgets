import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import Example from '../../Example';
import HStack from '@dojo/widgets/stack/HStack';
import RadioGroup from '@dojo/widgets/radio-group';
import Switch from '@dojo/widgets/switch';

const factory = create({ icache });

export default factory(function Align({ middleware: { icache } }) {
	const value = icache.getOrSet('align', 'middle');
	return (
		<Example>
			<div>
				<RadioGroup
					value={value}
					name="align"
					onValue={(value) => {
						icache.set('align', value);
					}}
					options={[{ value: 'top' }, { value: 'middle' }, { value: 'bottom' }]}
				/>
				<div styles={{ border: '1px black solid', height: '60px' }}>
					<HStack align={value}>
						<div styles={{ height: '100%' }}>Hello World</div>
						<Switch value={false} onValue={() => {}} />
					</HStack>
				</div>
			</div>
		</Example>
	);
});
