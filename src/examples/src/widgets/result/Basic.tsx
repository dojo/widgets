import { create, tsx } from '@dojo/framework/core/vdom';
import Result from '@dojo/widgets/result';
import Button from '@dojo/widgets/button';
import { Icon } from '@dojo/widgets/icon';

const factory = create();

export default factory(function Basic() {
	return (
		<div styles={{ width: '400px' }}>
			<Result title="Hello, World" subTitle="Result SubTitle" status="success">
				{{
					content: () => <span>Result Content</span>,
					icon: () => <Icon type="checkIcon" />,
					actionButtons: () => (
						<virtual>
							<Button>Go Home</Button>
							<Button>Repeat Action</Button>
						</virtual>
					)
				}}
			</Result>
		</div>
	);
});
