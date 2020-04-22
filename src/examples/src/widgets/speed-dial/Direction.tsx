import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial, { SpeedDialAction } from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';
import NativeSelect from '@dojo/widgets/native-select';
import Example from '../../Example';
import { Orientation } from '@dojo/widgets/tooltip';

const factory = create({ icache });

export default factory(function Direction({ middleware: { icache } }) {
	const direction = icache.getOrSet('direction', 'right');
	return (
		<Example>
			<div styles={{ width: '500px', height: '500px' }}>
				<SpeedDial direction={direction}>
					{{
						actions(onClose, direction) {
							let orientation = Orientation.bottom;
							switch (direction) {
								case 'left':
									orientation = Orientation.top;
									break;
								case 'up':
									orientation = Orientation.right;
									break;
								case 'down':
									orientation = Orientation.left;
									break;
							}
							return [
								<SpeedDialAction
									tooltipOrientation={orientation}
									onAction={() => {
										icache.set('action', 'Mailing');
										onClose();
									}}
								>
									{{ tooltip: 'Mail', icon: <Icon type="mailIcon" /> }}
								</SpeedDialAction>,
								<SpeedDialAction
									tooltipOrientation={orientation}
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
				<div styles={{ marginTop: '20px' }}>
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
				</div>
			</div>
		</Example>
	);
});
