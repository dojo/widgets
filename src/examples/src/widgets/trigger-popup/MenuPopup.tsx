import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform, ListOption } from '@dojo/widgets/list';
import Button from '@dojo/widgets/button';
import TriggerPopup from '@dojo/widgets/trigger-popup';
import Example from '../../Example';
import { createResource } from '@dojo/framework/core/resource';

const factory = create();
const options = [
	{ value: 'Save' },
	{ value: 'copy', label: 'Copy' },
	{ value: 'Paste', disabled: true }
];
const resource = createResource<ListOption>();

export default factory(function MenuTriggerPopup() {
	return (
		<Example>
			<TriggerPopup position="below">
				{{
					trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Menu Popup</Button>,
					content: (onClose) => (
						<div styles={{ border: '1px solid black' }}>
							<List
								resource={resource(options)}
								transform={defaultTransform}
								onValue={onClose}
							/>
						</div>
					)
				}}
			</TriggerPopup>
		</Example>
	);
});
