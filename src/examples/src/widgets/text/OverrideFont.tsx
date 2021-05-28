import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Text from '@dojo/widgets/text';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function OverrideFont() {
	return (
		<Example>
			<virtual>
				<div style="--mdc-theme-font-family: 'Comic Sans MS', 'Comic Sans', cursive;">
					<Text variant="inherit" size="xxl">
						Override the variant font
					</Text>
				</div>
			</virtual>
		</Example>
	);
});
