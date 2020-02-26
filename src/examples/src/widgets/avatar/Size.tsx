import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';

const factory = create();

export default factory(function Basic() {
	return (
		<div
			styles={{
				width: '400px',
				display: 'flex',
				justifyContent: 'space-around',
				alignItems: 'center'
			}}
		>
			<Avatar size="small">D</Avatar>
			<Avatar size="medium">D</Avatar>
			<Avatar size="large">D</Avatar>
		</div>
	);
});
