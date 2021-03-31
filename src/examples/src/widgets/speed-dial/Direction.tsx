import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial, { Action } from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';
import NativeSelect from '@dojo/widgets/native-select';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Direction({ middleware: { icache } }) {
	const direction = icache.getOrSet('direction', 'left');
	return (
		<Example>
			<virtual>
				<SpeedDial direction={direction}>
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
					value={direction}
					options={[
						{ value: 'right' },
						{ value: 'left' },
						{ value: 'up' },
						{ value: 'down' }
					]}
					onValue={(direction) => {
						icache.set('direction', direction);
					}}
				/>
			</virtual>
		</Example>
	);
});
