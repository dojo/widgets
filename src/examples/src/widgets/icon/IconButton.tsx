import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '@dojo/widgets/icon';
import Button from '@dojo/widgets/button';
import Example from '../../Example';

const factory = create();

export default factory(function IconButton() {
	return (
		<Example>
			<Button>
				Send <Icon type="mailIcon" />
			</Button>
		</Example>
	);
});
