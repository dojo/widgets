import { create, tsx } from '@dojo/framework/core/vdom';
import Rate from '@dojo/widgets/rate';
import Example from '../../Example';
import Icon from '@dojo/widgets/icon';

const factory = create();

export default factory(function CustomIcon() {
	return (
		<Example>
			<Rate key="custom">
				{{
					label: 'How much help?',
					icon: <Icon size="large" type="helpIcon" />
				}}
			</Rate>
			<br />
			<Rate key="custom-half" allowHalf>
				{{
					label: 'Half eyes',
					icon: <Icon size="large" type="eyeIcon" />
				}}
			</Rate>
		</Example>
	);
});
