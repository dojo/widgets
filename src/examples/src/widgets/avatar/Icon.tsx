import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';
import Icon from '@dojo/widgets/icon';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px', display: 'flex', justifyContent: 'space-around' }}>
				<Avatar type="circle">
					<Icon type="secureIcon" />
				</Avatar>
				<Avatar type="rounded">
					<Icon type="secureIcon" />
				</Avatar>
				<Avatar type="square">
					<Icon type="secureIcon" />
				</Avatar>
			</div>
		</Example>
	);
});
