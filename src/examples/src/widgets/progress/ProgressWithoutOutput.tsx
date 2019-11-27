import { create, tsx } from '@dojo/framework/core/vdom';
import Progress from '@dojo/widgets/progress';

const factory = create();

export default factory(function ProgressWithoutOutput() {
	return <Progress value={50} showOutput={false} />;
});
