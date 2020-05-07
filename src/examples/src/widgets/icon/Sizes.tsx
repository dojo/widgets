import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '@dojo/widgets/icon';
import Example from '../../Example';

const factory = create();

export default factory(function Sizes() {
	return (
		<Example>
			<div>
				<span>SMALL</span>
				<Icon size="small" type="downIcon" />
				<Icon size="small" type="leftIcon" />
				<Icon size="small" type="rightIcon" />
				<Icon size="small" type="closeIcon" />
				<Icon size="small" type="plusIcon" />
				<Icon size="small" type="minusIcon" />
				<br />
				<span>MEDIUM</span>
				<Icon size="medium" type="downIcon" />
				<Icon size="medium" type="leftIcon" />
				<Icon size="medium" type="rightIcon" />
				<Icon size="medium" type="closeIcon" />
				<Icon size="medium" type="plusIcon" />
				<Icon size="medium" type="minusIcon" />
				<br />
				<span>LARGE</span>
				<Icon size="large" type="downIcon" />
				<Icon size="large" type="leftIcon" />
				<Icon size="large" type="rightIcon" />
				<Icon size="large" type="closeIcon" />
				<Icon size="large" type="plusIcon" />
				<Icon size="large" type="minusIcon" />
			</div>
		</Example>
	);
});
