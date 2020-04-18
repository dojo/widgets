import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function ShowTooltips({ middleware: { icache } }) {
	const action = icache.getOrSet('action', '');
	return (
		<virtual>
			<SpeedDial
				actions={[
					{
						label: <Icon type="mailIcon" />,
						onAction() {
							icache.set('action', 'Mailing');
						},
						tooltip: 'Mail something',
						alwaysShowTooltip: true
					},
					{
						label: <Icon type="dateIcon" />,
						onAction() {
							icache.set('action', 'Scheduling something');
						},
						tooltip: 'Schedule something',
						alwaysShowTooltip: true
					}
				]}
			/>
			<div>Last action: {action}</div>
		</virtual>
	);
});
