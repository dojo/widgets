import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import Button from '@dojo/widgets/button';
import TriggerPopup from '@dojo/widgets/trigger-popup';
import { createMemoryResourceWithData } from '../list/memoryTemplate';

const factory = create();
const options = [
	{ value: 'Save' },
	{ value: 'copy', label: 'Copy' },
	{ value: 'Paste', disabled: true }
];
const resource = createMemoryResourceWithData(options);

export default factory(function MenuTriggerPopup() {
	return (
		<TriggerPopup position="below">
			{{
				trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Menu Popup</Button>,
				content: (onClose) => (
					<div styles={{ border: '1px solid black' }}>
						<List resource={resource} transform={defaultTransform} onValue={onClose} />
					</div>
				)
			}}
		</TriggerPopup>
	);
});
