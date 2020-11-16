import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import ContextMenu from '@dojo/widgets/context-menu';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ resource, icache });
const options = [{ value: 'print', label: 'Print' }, { value: 'delete', label: 'Delete' }];
const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Basic({ id, middleware: { icache, resource } }) {
	const text = icache.getOrSet(
		'text',
		'This is some text that has a context menu. Right click to view the context menu and take an action on selected text'
	);
	const printedText = icache.getOrSet('printedText', '');

	return (
		<virtual>
			<ContextMenu
				resource={resource({ template, initOptions: { id, data: options } })}
				onSelect={(value) => {
					const selection = window.getSelection() || '';
					if (value.value === 'print') {
						icache.set('printedText', selection ? selection.toString() : '');
					} else if (
						value.value === 'delete' &&
						selection &&
						selection.anchorOffset !== selection.focusOffset
					) {
						icache.set(
							'text',
							`${text.slice(0, selection.anchorOffset)}${text.slice(
								selection.focusOffset
							)}`
						);
					}
				}}
			>
				{text}
			</ContextMenu>
			<div>Printed Text: {printedText}</div>
		</virtual>
	);
});
