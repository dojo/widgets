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
					onClick={() => {
						icache.set('action', 'Save');
					}}
				>
					{{
						label: 'Save',
						icon: <Icon type="starIcon" />
					}}
				</Action>
				<Action
					onClick={() => {
						icache.set('action', 'Timing');
					}}
				>
					{{
						label: 'Time',
						icon: <Icon type="clockIcon" />
					}}
				</Action>
				<Action
					onClick={() => {
						icache.set('action', 'Looking');
					}}
				>
					{{
						label: 'Look',
						icon: <Icon type="eyeIcon" />
					}}
				</Action>
				<Action
					onClick={() => {
						icache.set('action', 'Locating');
					}}
				>
					{{
						label: 'Locate',
						icon: <Icon type="locationIcon" />
					}}
				</Action>
			</SpeedDial>
			<div>Last action: {action}</div>
		</Example>
	);
});
