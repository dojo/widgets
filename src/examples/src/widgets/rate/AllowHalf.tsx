import { create, tsx } from '@dojo/framework/core/vdom';
import Rate from '@dojo/widgets/rate';
import Example from '../../Example';

const factory = create();

export default factory(function AllowHalf() {
	return (
		<Example>
			<Rate key="half" allowHalf initialValue={2.5}>
				{{
					label: 'What about half stars?'
				}}
			</Rate>
		</Example>
	);
});
