import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px', display: 'flex', justifyContent: 'space-around' }}>
				<Avatar secondary variant="circle">
					A
				</Avatar>
				<Avatar secondary variant="rounded">
					A
				</Avatar>
				<Avatar secondary variant="square">
					A
				</Avatar>
			</div>
		</Example>
	);
});
