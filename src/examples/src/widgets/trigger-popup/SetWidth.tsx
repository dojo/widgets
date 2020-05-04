import { create, tsx } from '@dojo/framework/core/vdom';
import TriggerPopup from '@dojo/widgets/trigger-popup';
import Button from '@dojo/widgets/button';
import Example from '../../Example';

const factory = create();

export default factory(function SetWidth() {
	return (
		<Example>
			<TriggerPopup position="below" matchWidth={false}>
				{{
					trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Own Width</Button>,
					content: () => (
						<div styles={{ background: 'orange', width: '350px', fontSize: '32px' }}>
							My Width is 150px!
						</div>
					)
				}}
			</TriggerPopup>
		</Example>
	);
});
