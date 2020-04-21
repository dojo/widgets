import { create, tsx } from '@dojo/framework/core/vdom';
import Progress from '@dojo/widgets/progress';
import Example from '../../Example';

const factory = create();

export default factory(function ProgressWithCustomOutput() {
	const value = 250;
	const max = 750;

	return (
		<Example>
			<Progress value={value} max={max}>
				{{
					output: (value, percent) => `${value} of ${max} is ${percent}%`
				}}
			</Progress>
		</Example>
	);
});
