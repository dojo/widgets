import { create, tsx } from '@dojo/framework/core/vdom';
import Result from '@dojo/widgets/result';

const factory = create();

export default factory(function Basic() {
	return (
		<div>
			<Result title="Hello, World" subtitle="Result SubTitle" status="info">
				{{
					content: <span>Result Content</span>
				}}
			</Result>
		</div>
	);
});
