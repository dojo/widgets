import { create, tsx } from '@dojo/framework/core/vdom';
import Result, { Action } from '@dojo/widgets/result';
import Example from '../../Example';

const factory = create();

export default factory(function Error() {
	return (
		<Example>
			<Result title="Something Failed" subtitle="This is an error." status="error">
				{{
					content: <span>This is the error content.</span>,
					actionButtons: (
						<virtual>
							<Action>Go Back</Action>
							<Action>Try Again</Action>
						</virtual>
					)
				}}
			</Result>
		</Example>
	);
});
