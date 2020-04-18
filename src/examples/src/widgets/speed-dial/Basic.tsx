import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
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
						tooltip: 'Mail something'
					},
					{
						label: <Icon type="dateIcon" />,
						onAction() {
							icache.set('action', 'Scheduling something');
						},
						tooltip: 'Schedule something'
					}
				]}
			/>
			<div>Last action: {action}</div>
		</virtual>
	);
});
