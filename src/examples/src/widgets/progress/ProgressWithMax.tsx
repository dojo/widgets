import { create, tsx } from '@dojo/framework/core/vdom';
import Progress from '@dojo/widgets/progress';

const factory = create();

export default factory(function ProgressWithMax() {
	return <Progress value={0.3} max={1} />;
});
