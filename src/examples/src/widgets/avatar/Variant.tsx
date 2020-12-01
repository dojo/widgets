import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px', display: 'flex', justifyContent: 'space-around' }}>
				<Avatar type="circle">A</Avatar>
				<Avatar type="rounded">A</Avatar>
				<Avatar type="square">A</Avatar>
			</div>
		</Example>
	);
});
