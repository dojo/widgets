import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';

const factory = create();

export default factory(function Basic() {
	return (
		<div styles={{ width: '400px' }}>
			<Avatar>A</Avatar>
		</div>
	);
});
