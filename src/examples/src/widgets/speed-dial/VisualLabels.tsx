import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial, { Action } from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function VisualLabels({ middleware: { icache } }) {
	const action = icache.getOrSet('action', '');
	return (
		<Example>
			<SpeedDial>
				<Action
					label="Save"
					onClick={() => {
						icache.set('action', 'Save');
					}}
				>
					<Icon type="starIcon" />
				</Action>
				<Action
					label="Time"
					onClick={() => {
						icache.set('action', 'Timing');
					}}
				>
					<Icon type="clockIcon" />
				</Action>
				<Action
					label="Look"
					onClick={() => {
						icache.set('action', 'Looking');
					}}
				>
					<Icon type="eyeIcon" />
				</Action>
				<Action
					label="Locate"
					onClick={() => {
						icache.set('action', 'Locating');
					}}
				>
					<Icon type="locationIcon" />
				</Action>
			</SpeedDial>
			<div>Last action: {action}</div>
		</Example>
	);
});
