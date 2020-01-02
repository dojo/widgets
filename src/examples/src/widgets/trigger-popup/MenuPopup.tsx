import { create, tsx } from '@dojo/framework/core/vdom';
import Popup from '@dojo/widgets/popup';
import Menu from '@dojo/widgets/menu';
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
						<Menu options={options} onValue={onClose} total={options.length} />
					</div>
				)
			}}
		</TriggerPopup>
	);
});
