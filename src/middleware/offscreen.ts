import { renderer, create, getRegistry } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';
import { RenderResult } from '@dojo/framework/core/interfaces';

const factory = create({ getRegistry });

export const offscreen = factory(function offscreen({ middleware: { getRegistry } }) {
	return <RESULT>(
		renderFunction: () => RenderResult,
		predicate: (node: HTMLDivElement) => RESULT
	): RESULT => {
		const handler = getRegistry();
		const registry = handler ? handler.base : undefined;
		const domNode = global.document.createElement('div');
		domNode.style.position = 'absolute';
		global.document.body.appendChild(domNode);
		const r = renderer(renderFunction);
		r.mount({ domNode, sync: true, registry });
		const result = predicate(domNode);
		global.document.body.removeChild(domNode);
		return result;
	};
});

export default offscreen;
