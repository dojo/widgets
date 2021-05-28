import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import Example from '../../Example';

const factory = create();

export default factory(function Outlined() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px' }}>
				<Card kind="outlined" title="Outlined Card">
					{{
						content: (
							<span>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
								cursus sem. Nullam rhoncus nisl massa, sed sollicitudin purus
								dapibus quis. Maecenas aliquet justo nec cursus sagittis. Vestibulum
								dignissim mollis sem. Donec tristique mi imperdiet, ultrices magna
								nec, venenatis nibh. Curabitur auctor dignissim lacus, quis lobortis
								ligula euismod in. Donec tincidunt tempus elementum.
							</span>
						)
					}}
				</Card>
			</div>
		</Example>
	);
});
