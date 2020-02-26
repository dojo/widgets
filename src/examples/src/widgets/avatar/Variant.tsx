import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';

const factory = create();

export default factory(function Basic() {
	return (
		<div styles={{ width: '400px', display: 'flex', justifyContent: 'space-around' }}>
			<Avatar variant="circle">D</Avatar>
			<Avatar variant="rounded">D</Avatar>
			<Avatar variant="square">D</Avatar>
		</div>
	);
});
