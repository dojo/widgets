import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial, { SpeedDialAction } from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';
import { Orientation } from '@dojo/widgets/tooltip';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function ShowTooltips({ middleware: { icache } }) {
	const action = icache.getOrSet('action', '');
	return (
		<Example>
			<SpeedDial direction="up">
				{{
					actions(onClose) {
						return [
							<SpeedDialAction
								tooltipOpen={true}
								tooltipOrientation={Orientation.right}
								onAction={() => {
									icache.set('action', 'Mailing');
									onClose();
								}}
							>
								{{ tooltip: 'Mail', icon: <Icon type="mailIcon" /> }}
							</SpeedDialAction>,
							<SpeedDialAction
								tooltipOpen={true}
								tooltipOrientation={Orientation.right}
								onAction={() => {
									icache.set('action', 'Scheduling something');
									onClose();
								}}
							>
								{{ tooltip: 'Schedule', icon: <Icon type="dateIcon" /> }}
							</SpeedDialAction>
						];
					}
				}}
			</SpeedDial>
			<div>Last action: {action}</div>
		</Example>
	);
});
