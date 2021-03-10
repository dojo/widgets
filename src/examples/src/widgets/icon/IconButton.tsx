import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '@dojo/widgets/icon';
import Button from '@dojo/widgets/button';
import RaisedButton from '@dojo/widgets/raised-button';
import OutlinedButton from '@dojo/widgets/outlined-button';
import ActionButton from '@dojo/widgets/action-button';
import Example from '../../Example';

const factory = create();

export default factory(function IconButton() {
	return (
		<Example>
			<div style="display: flex; gap: 16px;">
				<Button>
					Send <Icon type="mailIcon" size="small" />
				</Button>
				<RaisedButton>
					Search <Icon type="searchIcon" size="small" />
				</RaisedButton>
				<OutlinedButton>
					Schedule <Icon type="dateIcon" size="small" />
				</OutlinedButton>
				<ActionButton>
					Stop <Icon type="cancelIcon" size="small" />
				</ActionButton>
			</div>
		</Example>
	);
});
