// TODO: should this module be in @dojo/framework?
import { create, node } from '@dojo/framework/core/vdom';

function stopEvent(event: Event) {
	event.preventDefault();
	event.stopPropagation();
}

const factory = create({ node });

export const dnd = factory(function dnd({ middleware: { node } }) {
	// TODO: remove event listeners
	return {
		onDragEnter(key: string | number, callback: (event: DragEvent) => void) {
			const domNode = node.get(key);
			if (domNode) {
				domNode.addEventListener('dragenter', callback);
			}
		},

		onDragLeave(key: string | number, callback: (event: DragEvent) => void) {
			const domNode = node.get(key);
			if (domNode) {
				domNode.addEventListener('dragleave', callback);
			}
		},

		onDragOver(key: string | number, callback: (event: DragEvent) => void) {
			const domNode = node.get(key);
			if (domNode) {
				domNode.addEventListener('dragover', callback);
			}
		},

		onDrop(key: string | number, callback: (event: DragEvent) => void) {
			const domNode = node.get(key);
			if (domNode) {
				domNode.addEventListener('drop', callback);
			}
		}
	};
});

export default dnd;
