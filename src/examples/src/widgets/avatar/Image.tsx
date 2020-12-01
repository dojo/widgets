import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';
const avatar = require('./img/dojo.jpg');

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px', display: 'flex', justifyContent: 'space-around' }}>
				<Avatar src={avatar} alt="Dojo" />
				<Avatar type="rounded" src={avatar} alt="Dojo" />
				<Avatar type="square" src={avatar} alt="Dojo" />
			</div>
		</Example>
	);
});
