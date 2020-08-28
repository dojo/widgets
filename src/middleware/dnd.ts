// TODO: this module should probably be in @dojo/framework
// TODO: this is a minimal implementation suitable for
// external file DnD as implemented in @dojo/widgets/file-upload-input

import { create, destroy, invalidator, node } from '@dojo/framework/core/vdom';

export interface DndResults {
	files?: File[];
	isDragging: boolean;
	isDropped: boolean;
}

function createResults(): DndResults {
	return {
		isDragging: false,
		isDropped: false
	};
}

const emptyResults = Object.freeze(createResults());

const factory = create({ destroy, invalidator, node });

export const dnd = factory(function dnd({ middleware: { destroy, invalidator, node } }) {
	const handles: Function[] = [];
	let nodeMap = new WeakMap<HTMLElement, DndResults>();

	function onDragEnter(event: DragEvent) {
		event.preventDefault();

		const results = nodeMap.get(event.currentTarget as HTMLElement);
		if (results && results.isDragging === false) {
			results.isDragging = true;
			invalidator();
		}
	}

	function onDragLeave(event: DragEvent) {
		event.preventDefault();

		const results = nodeMap.get(event.currentTarget as HTMLElement);
		if (results && results.isDragging === true) {
			results.isDragging = false;
			invalidator();
		}
	}

	// The default action for this event is to reset the current drag operation so it is necessary to add a handler
	// to any valid DnD target that prevents the default action.
	// https://developer.mozilla.org/en-US/docs/Web/API/Document/dragover_event
	function onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();

		const results = nodeMap.get(event.currentTarget as HTMLElement);
		if (results) {
			results.isDragging = false;
			results.isDropped = true;
			results.files =
				event.dataTransfer && event.dataTransfer.files.length
					? Array.from(event.dataTransfer.files)
					: [];
			invalidator();
		}
	}

	function addListeners(node: HTMLElement) {
		node.addEventListener('dragenter', onDragEnter);
		node.addEventListener('dragover', onDragOver);
		node.addEventListener('dragleave', onDragLeave);
		node.addEventListener('drop', onDrop);

		handles.push(function() {
			node.removeEventListener('dragenter', onDragEnter);
			node.removeEventListener('dragover', onDragOver);
			node.removeEventListener('dragleave', onDragLeave);
			node.removeEventListener('drop', onDrop);
		});
	}

	destroy(function() {
		let handle: any;
		while ((handle = handles.pop())) {
			handle && handle();
		}
	});

	return {
		get(key: string | number): Readonly<DndResults> {
			const domNode = node.get(key);

			if (!domNode) {
				return emptyResults;
			}

			if (!nodeMap.has(domNode)) {
				nodeMap.set(domNode, createResults());
				addListeners(domNode);

				return emptyResults;
			}

			const results = Object.assign({}, nodeMap.get(domNode));
			return results;
		},

		// When dropping a file there is no event that follows `drop` to signify the DnD operation has completed.
		// This method allows the consumer to reset the dnd middleware once the drop data has been received.
		reset(key: string | number) {
			const domNode = node.get(key);

			if (!domNode) {
				return;
			}

			if (nodeMap.has(domNode)) {
				nodeMap.set(domNode, createResults());
				invalidator();
			}
		}
	};
});

export default dnd;
