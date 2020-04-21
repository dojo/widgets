import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const action = icache.getOrSet('action', '');
	return (
		<Example>
			<SpeedDial
				actions={[
					{
						label: <Icon type="mailIcon" />,
						onAction() {
							icache.set('action', 'Mailing');
						},
						tooltip: 'Mail'
					},
					{
						label: <Icon type="dateIcon" />,
						onAction() {
							icache.set('action', 'Scheduling something');
						},
						tooltip: 'Schedule'
					},
					{
						label: <Icon type="clockIcon" />,
						onAction() {
							icache.set('action', 'Clock');
						},
						tooltip: 'Clock'
					},
					{
						label: <Icon type="editIcon" />,
						onAction() {
							icache.set('action', 'Editing');
						},
						tooltip: 'Edit'
					},
					{
						label: <Icon type="searchIcon" />,
						onAction() {
							icache.set('action', 'Searching');
						},
						tooltip: 'Search'
					},
					{
						label: <Icon type="downIcon" />,
						onAction() {
							icache.set('action', 'Navigating');
						},
						tooltip: 'Down'
					}
				]}
			/>
			<div>Last action: {action}</div>
		</Example>
	);
});
