import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '@dojo/widgets/icon';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function IconButton() {
	return (
		<Button>
			Send <Icon type="mailIcon" />
		</Button>
	);
});
