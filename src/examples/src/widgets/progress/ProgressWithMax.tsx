import { create, tsx } from '@dojo/framework/core/vdom';
import Progress from '@dojo/widgets/progress';
import Example from '../../Example';

const factory = create();

export default factory(function ProgressWithMax() {
	return (
		<Example>
			<Progress value={0.3} max={1} />
		</Example>
	);
});
