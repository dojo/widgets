import { create, tsx } from '@dojo/framework/core/vdom';
import Result from '@dojo/widgets/result';
import Button from '@dojo/widgets/button';
import Example from '../../Example';

const factory = create();

export default factory(function Alert() {
	return (
		<Example>
			<Result title="Alert Result" subtitle="This is an alert." status="alert">
				{{
					content: <span>Content describing the alert.</span>,
					actionButtons: (
						<virtual>
							<Button>Alert Action</Button>
						</virtual>
					)
				}}
			</Result>
		</Example>
	);
});
