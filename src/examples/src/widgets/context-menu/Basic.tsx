import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import ContextMenu, { defaultTransform } from '@dojo/widgets/context-menu';
import { createMemoryResourceWithData } from '../list/memoryTemplate';
import Example from '../../Example';

const factory = create({ icache });
const options = [{ value: 'print', label: 'Print' }, { value: 'delete', label: 'Delete' }];
const resource = createMemoryResourceWithData(options);

export default factory(function Basic({ middleware: { icache } }) {
	const text = icache.getOrSet(
		'text',
		'This is some text that has a context menu. Right click to view the context menu and take an action on selected text'
	);
	const printedText = icache.getOrSet('printedText', '');

	return (
		<Example>
			<ContextMenu
				resource={resource}
				transform={defaultTransform}
				onSelect={(value) => {
					const selection = window.getSelection() || '';
					if (value === 'print') {
						icache.set('printedText', selection ? selection.toString() : '');
					} else if (
						value === 'delete' &&
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
		</Example>
	);
});
