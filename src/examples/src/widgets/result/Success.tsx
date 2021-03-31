import { create, tsx } from '@dojo/framework/core/vdom';
import Result, { Action } from '@dojo/widgets/result';
import Example from '../../Example';

const factory = create();

export default factory(function Error() {
	return (
		<Example>
			<Result title="Success Result" subtitle="This is an success result." status="success">
				{{
					content: <span>This is the success content.</span>,
					actionButtons: (
						<virtual>
							<Action>OK</Action>
						</virtual>
					)
				}}
			</Result>
		</Example>
	);
});
