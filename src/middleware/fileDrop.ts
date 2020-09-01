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

export const fileDrop = factory(function fileDrop({ middleware: { destroy, invalidator, node } }) {
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
	function preventDefault(event: DragEvent) {
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

	function initResults(targetNode: HTMLElement, overlayNode: HTMLElement) {
		// both nodes share the same results object
		const newResults = createResults();
		nodeMap.set(targetNode, newResults);
		nodeMap.set(overlayNode, newResults);
	}

	function addListeners(targetNode: HTMLElement, overlayNode: HTMLElement) {
		targetNode.addEventListener('dragenter', onDragEnter);
		overlayNode.addEventListener('dragenter', preventDefault);
		overlayNode.addEventListener('dragover', preventDefault);
		overlayNode.addEventListener('dragleave', onDragLeave);
		overlayNode.addEventListener('drop', onDrop);

		handles.push(function() {
			targetNode.removeEventListener('dragenter', onDragEnter);
			overlayNode.removeEventListener('dragenter', preventDefault);
			overlayNode.removeEventListener('dragover', preventDefault);
			overlayNode.removeEventListener('dragleave', onDragLeave);
			overlayNode.removeEventListener('drop', onDrop);
		});
	}

	destroy(function() {
		let handle: any;
		while ((handle = handles.pop())) {
			handle && handle();
		}
	});

	return {
		get(targetKey: string | number, overlayKey: string | number): Readonly<DndResults> {
			const targetNode = node.get(targetKey);
			const overlayNode = node.get(overlayKey);

			if (!(targetNode && overlayNode)) {
				// TODO: throw error? log warning?
				return emptyResults;
			}

			if (!nodeMap.has(targetNode)) {
				initResults(targetNode, overlayNode);
				addListeners(targetNode, overlayNode);

				return emptyResults;
			}

			const results = Object.assign({}, nodeMap.get(targetNode));
			return results;
		},

		// When dropping a file there is no event that follows `drop` to signify the DnD operation has completed.
		// This method allows the consumer to reset the dnd middleware once the drop data has been received.
		reset(targetKey: string | number, overlayKey: string | number) {
			const targetNode = node.get(targetKey);
			const overlayNode = node.get(overlayKey);

			if (!(targetNode && overlayNode)) {
				// TODO: throw error? log warning?
				return emptyResults;
			}

			initResults(targetNode, overlayNode);
			invalidator();
		}
	};
});

export default fileDrop;
