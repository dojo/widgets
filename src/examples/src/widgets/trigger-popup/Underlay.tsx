import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import TriggerPopup from '@dojo/widgets/trigger-popup';
import Example from '../../Example';

const factory = create();

export default factory(function Underlay() {
	return (
		<Example>
			<TriggerPopup position="below" underlayVisible={true}>
				{{
					trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Underlay</Button>,
					content: () => (
						<div styles={{ background: 'yellow', height: '150px', fontSize: '32px' }}>
							I'm on a visible underlay
						</div>
					)
				}}
			</TriggerPopup>
		</Example>
	);
});
