import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div>
				<Radio disabled />
				<Radio checked disabled />
			</div>
		</Example>
	);
});
