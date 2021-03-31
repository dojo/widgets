import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial, { Action } from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const action = icache.getOrSet('action', '');
	return (
		<Example>
			<virtual>
				<SpeedDial>
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
				<div>Last action: {action}</div>
			</virtual>
		</Example>
	);
});
