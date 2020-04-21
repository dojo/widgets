import { create, tsx } from '@dojo/framework/core/vdom';
import Progress from '@dojo/widgets/progress';
import Example from '../../Example';

const factory = create();

export default factory(function ProgressWithoutOutput() {
	return (
		<Example>
			<Progress value={50} showOutput={false} />
		</Example>
	);
});
