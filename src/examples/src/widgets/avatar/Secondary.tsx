import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px', display: 'flex', justifyContent: 'space-around' }}>
				<Avatar secondary type="circle">
					A
				</Avatar>
				<Avatar secondary type="rounded">
					A
				</Avatar>
				<Avatar secondary type="square">
					A
				</Avatar>
			</div>
		</Example>
	);
});
