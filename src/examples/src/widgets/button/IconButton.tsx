import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import Example from '../../Example';
import Icon from '@dojo/widgets/icon';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<virtual>
				<Button>
					{{
						icon: <Icon type="starIcon" size="small" />
					}}
				</Button>
				<Button>
					{{
						icon: <Icon type="checkIcon" size="small" />,
						label: 'Icon Button'
					}}
				</Button>
				<Button iconPosition="after">
					{{
						icon: <Icon type="editIcon" size="small" />,
						label: 'Edit'
					}}
				</Button>
			</virtual>
		</Example>
	);
});
