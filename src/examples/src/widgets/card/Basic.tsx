import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px' }}>
				<Card title="Hello, World">
					{{
						content: <span>Lorem ipsum</span>
					}}
				</Card>
			</div>
		</Example>
	);
});
