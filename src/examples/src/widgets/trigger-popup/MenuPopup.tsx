import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import Button from '@dojo/widgets/button';
import TriggerPopup from '@dojo/widgets/trigger-popup';

const factory = create();

export default factory(function MenuTriggerPopup() {
	const options = [
		{ value: 'Save' },
		{ value: 'copy', label: 'Copy' },
		{ value: 'Paste', disabled: true }
	];

	return (
		<TriggerPopup position="below">
			{{
				trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Menu Popup</Button>,
				content: (onClose) => (
					<div styles={{ border: '1px solid black' }}>
						<List options={options} onValue={onClose} total={options.length} />
					</div>
				)
			}}
		</TriggerPopup>
	);
});
