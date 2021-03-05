import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial, { Action, SpeedDialPositions } from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';
import NativeSelect, { MenuOption } from '@dojo/widgets/native-select';
import Example from '../../Example';

const factory = create({ icache });
type Directions = 'right' | 'left' | 'up' | 'down';

export default factory(function Direction({ middleware: { icache } }) {
	const position: SpeedDialPositions = icache.getOrSet('position', 'bottom-right');
	const supportedDirections = getSupportedDirections(position);
	let direction: Directions | undefined = icache.get('direction');
	return (
		<Example>
			<virtual>
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
				<NativeSelect
					value={position}
					options={[
						{ value: 'bottom-right' },
						{ value: 'bottom-center' },
						{ value: 'bottom-left' },
						{ value: 'left-center' },
						{ value: 'right-center' },
						{ value: 'top-right' },
						{ value: 'top-center' },
						{ value: 'top-left' }
					]}
					onValue={(position) => {
						icache.set('position', position);
						icache.delete('direction');
					}}
				>
					Position
				</NativeSelect>
				<NativeSelect
					value={direction || ''}
					options={supportedDirections}
					disabled={supportedDirections.length === 1}
					onValue={(direction?: string) => {
						icache.set('direction', direction || undefined);
					}}
				>
					Direction
				</NativeSelect>
			</virtual>
		</Example>
	);
});

function getSupportedDirections(position: SpeedDialPositions) {
	const options: MenuOption[] = [{ value: '', label: 'unset' }];
	if (position.endsWith('-center')) {
		return options;
	}
	if (position.startsWith('bottom-')) {
		options.push({ value: 'up' });
	}
	if (position.startsWith('top-')) {
		options.push({ value: 'down' });
	}
	if (position.endsWith('-left')) {
		options.push({ value: 'right' });
	}
	if (position.endsWith('-right')) {
		options.push({ value: 'left' });
	}
	return options;
}
