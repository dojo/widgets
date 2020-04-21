import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div
				styles={{
					width: '400px',
					display: 'flex',
					justifyContent: 'space-around',
					alignItems: 'center'
				}}
			>
				<Avatar size="small">A</Avatar>
				<Avatar size="medium">A</Avatar>
				<Avatar size="large">A</Avatar>
			</div>
		</Example>
	);
});
