import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import Button from '@dojo/widgets/button';
import TriggerPopup from '@dojo/widgets/trigger-popup';
import { createMemoryTemplate } from '../list/memoryTemplate';
import { createResource } from '@dojo/framework/core/resource';

const factory = create();
const memoryTemplate = createMemoryTemplate();

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
						<List
							resource={{
								resource: () => createResource(memoryTemplate),
								data: options
							}}
							transform={defaultTransform}
							onValue={onClose}
						/>
					</div>
				)
			}}
		</TriggerPopup>
	);
});
