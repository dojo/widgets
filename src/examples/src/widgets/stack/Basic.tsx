import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

import Example from '../../Example';
import Stack, { StackProperties } from '@dojo/widgets/stack/Stack';
import RadioGroup from '@dojo/widgets/radio-group';
import Checkbox from '@dojo/widgets/checkbox';
import Spacer from '@dojo/widgets/stack/Spacer';

const icache = createICacheMiddleware<StackProperties>();

const factory = create({ icache });

const Box = factory(function Box() {
	return (
		<div
			styles={{
				background: `#${Math.floor(Math.random() * 16777215)
					.toString(16)
					.padStart(6, '0')}`,
				width: '25px',
				height: '25px'
			}}
		/>
	);
});

export default factory(function Basic({ middleware: { icache } }) {
	const stretch = icache.get('stretch');
	const align = icache.getOrSet('align', 'middle');
	const padding = icache.get('padding');
	const spacing = icache.get('spacing');
	const direction = icache.getOrSet('direction', 'horizontal');

	return (
		<Example>
			<virtual>
				<Stack direction="horizontal" stretch align="start">
					<RadioGroup
						value={direction}
						name="direction"
						onValue={(value: any) => {
							icache.set('direction', value);
						}}
						options={[{ value: 'horizontal' }, { value: 'vertical' }]}
					>
						{{ label: 'Direction' }}
					</RadioGroup>
					<RadioGroup
						value={spacing}
						name="spacing"
						onValue={(value: any) => {
							if (!value) {
								icache.delete('spacing');
							} else {
								icache.set('spacing', value);
							}
						}}
						options={[
							{ value: '', label: 'None' },
							{ value: 'small' },
							{ value: 'medium' },
							{ value: 'large' }
						]}
					>
						{{ label: 'Spacing' }}
					</RadioGroup>
					<Spacer />
					<RadioGroup
						value={align}
						name="align"
						onValue={(value: any) => {
							icache.set('align', value);
						}}
						options={[{ value: 'start' }, { value: 'middle' }, { value: 'end' }]}
					>
						{{ label: 'Alignment' }}
					</RadioGroup>
					<Spacer />
					<RadioGroup
						value={padding}
						name="padding"
						onValue={(value: any) => {
							if (!value) {
								icache.delete('padding');
							} else {
								icache.set('padding', value);
							}
						}}
						options={[
							{ value: '', label: 'None' },
							{ value: 'small' },
							{ value: 'medium' },
							{ value: 'large' }
						]}
					>
						{{ label: 'Padding' }}
					</RadioGroup>
					<Spacer />
					<div>
						<Checkbox
							checked={!!stretch}
							onValue={(value) => icache.set('stretch', value)}
						>
							Stretch
						</Checkbox>
					</div>
				</Stack>

				<Stack direction="horizontal">
					<div styles={{ border: 'grey solid 1px', height: '250px', width: '250px' }}>
						<Stack
							direction={direction}
							spacing={spacing}
							align={align}
							stretch={stretch}
							padding={padding}
						>
							<Box />
							<Box />
							<Box />
							<Box />
							<Box />
						</Stack>
					</div>
				</Stack>
			</virtual>
		</Example>
	);
});
