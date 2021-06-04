import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';
import Icon from '@dojo/widgets/icon';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<TextInput>
				{{
					label: 'Input label',
					leading: <Icon type="dateIcon" />,
					trailing: <Icon type="dateIcon" />
				}}
			</TextInput>
		</Example>
	);
});
