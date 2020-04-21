import { create, tsx } from '@dojo/framework/core/vdom';
import TriggerPopup from '@dojo/widgets/trigger-popup';
import Button from '@dojo/widgets/button';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div>
				<TriggerPopup position="below">
					{{
						trigger: (onToggleOpen) => (
							<Button onClick={onToggleOpen}>Popup Below</Button>
						),
						content: (onClose) => (
							<div
								onpointerleave={onClose}
								styles={{ background: 'red', height: '100px', fontSize: '32px' }}
							>
								Hello Below!
							</div>
						)
					}}
				</TriggerPopup>
				<TriggerPopup position="above">
					{{
						trigger: (onToggleOpen) => (
							<Button onClick={onToggleOpen}>Popup Above</Button>
						),
						content: (onClose) => (
							<div
								onpointerleave={onClose}
								styles={{ background: 'green', height: '100px', fontSize: '32px' }}
							>
								Hello Above!
							</div>
						)
					}}
				</TriggerPopup>
			</div>
		</Example>
	);
});
