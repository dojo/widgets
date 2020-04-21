import { create, tsx } from '@dojo/framework/core/vdom';
import Progress from '@dojo/widgets/progress';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<Progress value={50} />
		</Example>
	);
});
