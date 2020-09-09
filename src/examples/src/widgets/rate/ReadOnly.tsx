import { create, tsx } from '@dojo/framework/core/vdom';
import Rate from '@dojo/widgets/rate';
import Example from '../../Example';

const factory = create();

export default factory(function ReadOnly() {
	return (
		<Example>
			<Rate key="half" readOnly initialValue={3}>
				{{
					label: 'read only stars?'
				}}
			</Rate>
		</Example>
	);
});
