import { create, tsx } from '@dojo/framework/core/vdom';
import SpeedDial, { Action } from '@dojo/widgets/speed-dial';
import Icon from '@dojo/widgets/icon';
import icache from '@dojo/framework/core/middleware/icache';
import NativeSelect from '@dojo/widgets/native-select';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Direction({ middleware: { icache } }) {
	const direction = icache.getOrSet('direction', 'right');
	return (
		<Example>
			<div styles={{ width: '500px', height: '500px' }}>
				<SpeedDial direction={direction}>
					<Action
						title="boo"
						onClick={() => {
							icache.set('action', 'Mailing');
						}}
					>
						<Icon type="mailIcon" />
					</Action>
					<Action
						title="apple"
						onClick={() => {
							icache.set('action', 'Save');
						}}
					>
						<Icon type="starIcon" />
					</Action>
					<Action
						onClick={() => {
							icache.set('action', 'Mailing');
						}}
					>
						<Icon type="mailIcon" />
					</Action>
					<Action
						onClick={() => {
							icache.set('action', 'Save');
						}}
					>
						<Icon type="starIcon" />
					</Action>
					<Action
						onClick={() => {
							icache.set('action', 'Mailing');
						}}
					>
						<Icon type="mailIcon" />
					</Action>
					<Action
						onClick={() => {
							icache.set('action', 'Save');
						}}
					>
						<Icon type="starIcon" />
					</Action>
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
