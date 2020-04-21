import { create, tsx } from '@dojo/framework/core/vdom';
import Result from '@dojo/widgets/result';
import Button from '@dojo/widgets/button';
import Example from '../../Example';
const dojo = require('../avatar/img/dojo.jpg');

const factory = create();

export default factory(function Alert() {
	return (
		<Example>
			<Result title="Custom Icon Image" subtitle="This uses a custom icon image.">
				{{
					icon: <img src={dojo} styles={{ maxWidth: '96px' }} />,
					content: <span>Content describing the alert.</span>,
					actionButtons: (
						<virtual>
							<Button>Result Action</Button>
						</virtual>
					)
				}}
			</Result>
		</Example>
	);
});
