import { create, tsx } from '@dojo/framework/core/vdom';
import Popup from '@dojo/widgets/popup';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function Underlay() {
	return (
		<Popup position="below" underlayVisible={true}>
			{{
				trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Underlay</Button>,
				content: (onClose) => (
					<div
						onpointerleave={onClose}
						styles={{ background: 'yellow', height: '150px', fontSize: '32px' }}
					>
						I'm on a visible underlay
					</div>
				)
			}}
		</Popup>
	);
});
