import { create, tsx } from '@dojo/framework/core/vdom';
import Slider from '@dojo/widgets/slider';
import Example from '../../Example';

const factory = create({});

export default factory(function Basic({}) {
	return (
		<Example>
			<Slider min={0} max={100} />
		</Example>
	);
});
