import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div styles={{ width: '400px' }}>
				<Avatar>A</Avatar>
			</div>
		</Example>
	);
});
