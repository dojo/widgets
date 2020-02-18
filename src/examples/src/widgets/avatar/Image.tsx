import { create, tsx } from '@dojo/framework/core/vdom';
import Avatar from '@dojo/widgets/avatar';
const avatar = require('./img/dojo.jpg');

const factory = create();

export default factory(function Basic() {
	return (
		<div styles={{ width: '400px', display: 'flex', justifyContent: 'space-around' }}>
			<Avatar src={avatar} alt="Dojo" />
			<Avatar variant="rounded" src={avatar} alt="Dojo" />
			<Avatar variant="square" src={avatar} alt="Dojo" />
		</div>
	);
});
