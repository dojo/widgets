import { create, tsx } from '@dojo/framework/core/vdom';
import Result from '@dojo/widgets/result';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function Error() {
	return (
		<div>
			<Result title="Something Failed" subtitle="This is an error." status="error">
				{{
					content: <span>This is the error content.</span>,
					actionButtons: (
						<virtual>
							<Button>Go Back</Button>
							<Button>Try Again</Button>
						</virtual>
					)
				}}
			</Result>
		</div>
	);
});
