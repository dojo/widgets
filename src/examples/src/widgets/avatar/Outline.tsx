import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';

const factory = create();

export default factory(function Outline() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px', display: 'flex', justifyContent: 'space-around' }}>
				<Avatar outline>A</Avatar>
				<Avatar secondary outline>
					A
				</Avatar>
			</div>
		</Example>
	);
});
