import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial, { Action, SpeedDialPositions } from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';
import NativeSelect from '@dojo/widgets/native-select';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Direction({ middleware: { icache } }) {
	const position: SpeedDialPositions | undefined =
		icache.getOrSet('position', 'bottom-right') || undefined;
	const direction: 'right' | 'left' | 'up' | 'down' | undefined =
		icache.get('direction') || undefined;
	return (
		<Example>
			<div styles={{ width: '500px', height: '500px' }}>
				<SpeedDial position={position} direction={direction}>
					<Action
						onClick={() => {
							icache.set('action', 'Mailing');
						}}
					>
						<Icon type="mailIcon" />
					</Action>
					<Action
						onClick={() => {
							icache.set('action', 'Save');
						}}
					>
						<Icon type="starIcon" />
					</Action>
					<Action
						onClick={() => {
							icache.set('action', 'Timing');
						}}
					>
						<Icon type="clockIcon" />
					</Action>
					<Action
						onClick={() => {
							icache.set('action', 'Looking');
						}}
					>
						<Icon type="eyeIcon" />
					</Action>
					<Action
						onClick={() => {
							icache.set('action', 'Locating');
						}}
					>
						<Icon type="locationIcon" />
					</Action>
				</SpeedDial>
				<div styles={{ marginTop: '20px' }}>
					<NativeSelect
						value={position || ''}
						options={[
							{ value: 'bottom-right' },
							{ value: 'bottom-center' },
							{ value: 'bottom-left' },
							{ value: 'left-center' },
							{ value: 'right-center' },
							{ value: 'top-right' },
							{ value: 'top-center' },
							{ value: 'top-left' },
							{ value: '', label: 'unset' }
						]}
						onValue={(position?: string) => {
							icache.set('position', position);
						}}
					/>
					<NativeSelect
						value={direction || ''}
						options={[
							{ value: 'right' },
							{ value: 'left' },
							{ value: 'up' },
							{ value: 'down' },
							{ value: '', label: 'unset' }
						]}
						onValue={(direction?: string) => {
							icache.set('direction', direction);
						}}
					/>
				</div>
			</div>
		</Example>
	);
});
