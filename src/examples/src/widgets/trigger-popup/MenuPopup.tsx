import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListOption } from '@dojo/widgets/list';
import Button from '@dojo/widgets/button';
import TriggerPopup from '@dojo/widgets/trigger-popup';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ resource });
const options = [
	{ value: '1', label: 'Save' },
	{ value: '2', label: 'Copy' },
	{ value: '3', label: 'Paste', disabled: true }
];
const template = createMemoryResourceTemplate<ListOption>();

export default factory(function MenuTriggerPopup({ id, middleware: { resource } }) {
	return (
		<Example>
			<TriggerPopup position="below">
				{{
					trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Menu Popup</Button>,
					content: (onClose) => (
						<div styles={{ border: '1px solid black' }}>
							<List
								resource={resource({
									template,
									initOptions: { id, data: options }
								})}
								onValue={onClose}
							/>
						</div>
					)
				}}
			</TriggerPopup>
		</Example>
	);
});
