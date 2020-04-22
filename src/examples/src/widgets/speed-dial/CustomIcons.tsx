import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial, { SpeedDialAction } from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import { Icon as FABIcon } from '@dojo/widgets/floating-action-button';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function CustomIcons({ middleware: { icache } }) {
	const action = icache.getOrSet('action', '');
	return (
		<Example>
			<SpeedDial>
				{{
					actions(onClose) {
						return [
							<SpeedDialAction
								onAction={() => {
									icache.set('action', 'Mailing');
									onClose();
								}}
							>
								{{ tooltip: 'Mail', icon: <Icon type="mailIcon" /> }}
							</SpeedDialAction>,
							<SpeedDialAction
								onAction={() => {
									icache.set('action', 'Scheduling something');
									onClose();
								}}
							>
								{{ tooltip: 'Schedule', icon: <Icon type="dateIcon" /> }}
							</SpeedDialAction>,
							<SpeedDialAction
								onAction={() => {
									icache.set('action', 'Clock');
									onClose();
								}}
							>
								{{ tooltip: 'Clock', icon: <Icon type="clockIcon" /> }}
							</SpeedDialAction>,
							<SpeedDialAction
								onAction={() => {
									icache.set('action', 'Editing');
									onClose();
								}}
							>
								{{ tooltip: 'Edit', icon: <Icon type="editIcon" /> }}
							</SpeedDialAction>,
							<SpeedDialAction
								onAction={() => {
									icache.set('action', 'Searching');
									onClose();
								}}
							>
								{{ tooltip: 'Search', icon: <Icon type="searchIcon" /> }}
							</SpeedDialAction>,
							<SpeedDialAction
								onAction={() => {
									icache.set('action', 'Navigating');
									onClose();
								}}
							>
								{{ tooltip: 'Down', icon: <Icon type="downIcon" /> }}
							</SpeedDialAction>
						];
					},
					triggerIcon(open) {
						return open ? <FABIcon type="clockIcon" /> : <FABIcon type="editIcon" />;
					}
				}}
			</SpeedDial>
			<div>Last action: {action}</div>
		</Example>
	);
});
