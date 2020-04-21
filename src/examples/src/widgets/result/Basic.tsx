import { create, tsx } from '@dojo/framework/core/vdom';
import Result from '@dojo/widgets/result';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<Result title="Hello, World" subtitle="Result SubTitle" status="info">
				{{
					content: <span>Result Content</span>
				}}
			</Result>
		</Example>
	);
});
