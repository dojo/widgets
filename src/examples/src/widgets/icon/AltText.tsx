import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '@dojo/widgets/icon';

const factory = create();

export default factory(function Basic() {
	return <Icon type="leftIcon" altText="alt text" />;
});
