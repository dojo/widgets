import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '@dojo/widgets/icon';
import Button from '@dojo/widgets/button';
import RaisedButton from '@dojo/widgets/raised-button';
import OutlinedButton from '@dojo/widgets/outlined-button';
import ActionButton from '@dojo/widgets/action-button';
import Example from '../../Example';
import * as css from './IconButton.m.css';

const factory = create();

export default factory(function IconButton() {
	return (
		<Example>
			<div classes={[css.root]}>
				<Button>{{ icon: <Icon type="mailIcon" size="small" /> }}</Button>
				<OutlinedButton>{{ icon: <Icon type="starIcon" size="small" /> }}</OutlinedButton>
				<RaisedButton>{{ icon: <Icon type="plusIcon" size="small" /> }}</RaisedButton>
				<Button>
					{{
						icon: <Icon type="mailIcon" size="small" />,
						label: 'Send'
					}}
				</Button>
				<OutlinedButton iconPosition="after">
					{{
						icon: <Icon type="dateIcon" size="small" />,
						label: 'Schedule'
					}}
				</OutlinedButton>
				<ActionButton iconPosition="after">
					{{
						icon: <Icon type="searchIcon" size="small" />,
						label: 'Search'
					}}
				</ActionButton>
				<RaisedButton classes={{ '@dojo/widgets/button': { root: [css.fullWidth] } }}>
					{{
						icon: <Icon type="plusIcon" size="small" />,
						label: 'See All'
					}}
				</RaisedButton>
			</div>
		</Example>
	);
});
