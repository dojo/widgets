import { create, tsx } from '@dojo/framework/core/vdom';
import Result, { Action } from '@dojo/widgets/result';
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
							<Action>Alert Action</Action>
						</virtual>
					)
				}}
			</Result>
		</Example>
	);
});
