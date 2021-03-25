import { create, tsx } from '@dojo/framework/core/vdom';

import Example from '../../Example';
import Stack, { Spacer } from '@dojo/widgets/stack';

const factory = create();

const Box = factory.properties<{ stretch?: boolean }>()(function Box({ properties }) {
	const { stretch = false } = properties();
	return (
		<div
			styles={{
				background: `#${Math.floor(Math.random() * 16777215)
					.toString(16)
					.padStart(6, '0')}`,
				minWidth: '25px',
				width: '100%',
				height: stretch ? '100%' : '25px'
			}}
		/>
	);
});

export default factory(function HStackLayout() {
	return (
		<Example>
			<virtual>
				<Stack stretch direction="horizontal">
					<Spacer>
						<div styles={{ border: 'grey solid 1px', height: '250px', width: '100%' }}>
							<Stack direction="horizontal">
								<Box />
							</Stack>
						</div>
					</Spacer>
					<Spacer>
						<div
							styles={{
								border: 'grey solid 1px',
								borderRight: 'none',
								borderLeft: 'none',
								height: '250px',
								width: '100%'
							}}
						>
							<Stack direction="horizontal">
								<Box />
								<Spacer />
								<Box />
							</Stack>
						</div>
					</Spacer>
					<Spacer>
						<div styles={{ border: 'grey solid 1px', height: '250px', width: '100%' }}>
							<Stack direction="horizontal">
								<Spacer />
								<Box />
							</Stack>
						</div>
					</Spacer>
					<Spacer>
						<div styles={{ border: 'grey solid 1px', height: '250px', width: '100%' }}>
							<Stack direction="horizontal">
								<Box />
								<Spacer />
							</Stack>
						</div>
					</Spacer>
					<Spacer>
						<div styles={{ border: 'grey solid 1px', height: '250px', width: '100%' }}>
							<Stack direction="horizontal">
								<Spacer>
									<Box stretch />
								</Spacer>
								<Spacer span={2}>
									<Box stretch />
								</Spacer>
								<Spacer>
									<Box stretch />
								</Spacer>
							</Stack>
						</div>
					</Spacer>
				</Stack>
			</virtual>
		</Example>
	);
});
