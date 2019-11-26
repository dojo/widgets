import { create, tsx } from '@dojo/framework/core/vdom';
import Popup from '@dojo/widgets/popup';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function SetWidth() {
	return (
		<Popup position="below" matchWidth={false}>
			{{
				trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Own Width</Button>,
				content: (onClose) => (
					<div
						onpointerleave={onClose}
						styles={{ background: 'orange', width: '350px', fontSize: '32px' }}
					>
						My Width is 150px!
					</div>
				)
			}}
		</Popup>
	);
});
