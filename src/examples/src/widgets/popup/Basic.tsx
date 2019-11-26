import { create, tsx } from '@dojo/framework/core/vdom';
import Popup from '@dojo/widgets/popup';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function Basic() {
	return (
		<virtual>
			<Popup position="below">
				{{
					trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Popup Below</Button>,
					content: (onClose) => (
						<div
							onpointerleave={onClose}
							styles={{ background: 'red', height: '100px', fontSize: '32px' }}
						>
							Hello Below!
						</div>
					)
				}}
			</Popup>
			<Popup position="above">
				{{
					trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Popup Above</Button>,
					content: (onClose) => (
						<div
							onpointerleave={onClose}
							styles={{ background: 'green', height: '100px', fontSize: '32px' }}
						>
							Hello Above!
						</div>
					)
				}}
			</Popup>
		</virtual>
	);
});
