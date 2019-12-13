import { create, tsx } from '@dojo/framework/core/vdom';
import Progress from '@dojo/widgets/progress';

const factory = create();

export default factory(function Basic() {
	return <Progress value={50} />;
});
