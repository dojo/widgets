import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '@dojo/widgets/icon';
import Button from '@dojo/widgets/button';
import ActionButton from '@dojo/widgets/action-button';
import Example from '../../Example';
import * as css from './IconButton.m.css';

const factory = create();

export default factory(function IconButton() {
	return (
		<Example>
			<div classes={[css.root]}>
				<Button>{{ icon: <Icon type="mailIcon" size="small" /> }}</Button>
				<ActionButton iconPosition="after">
					{{
						icon: <Icon type="searchIcon" size="small" />,
						label: 'Search'
					}}
				</ActionButton>
			</div>
		</Example>
	);
});
