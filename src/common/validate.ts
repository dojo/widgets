import { after } from '@dojo/core/aspect';
import { assign } from '@dojo/shim/object';
import { DNode, HNode, WNode } from '@dojo/widget-core/interfaces';
import { handleDecorator } from '@dojo/widget-core/decorators/handleDecorator';
import { w } from '@dojo/widget-core/d';
import Tooltip from '../tooltip/Tooltip';

function findDNodeByKey(target: any, key: string | number): HNode | WNode | undefined {
	if (!target) {
		return;
	}
	if (Array.isArray(target)) {
		let found: HNode | WNode | undefined;
		target.forEach((node) => {
			if (found) {
				if (findDNodeByKey(node, key)) {
					console.warn(`Duplicate key of "${key}" found.`);
				}
			} else {
				found = findDNodeByKey(node, key);
			}
		});
		return found;
	} else {
		if (target && typeof target === 'object') {
			if (target.properties && target.properties.key === key) {
				return target;
			}
			return findDNodeByKey(target.children, key);
		}
	}
}

/**
 * Convenience function that wraps a validated node in a Tooltip
 */
export function renderValidatedContent(this: any, content: DNode) {
	const { invalid, theme} = this.properties;
	return w(Tooltip, {
		content: this.invalidMsg,
		open: invalid && this.invalidTextShowing,
		theme
	}, [ content ]);
}

/**
 * Decorator that can be used to show a message by an invalid form node
 */
export function validate(key: string | number, showEvent: string, hideEvent: string, msg: DNode) {
	function beforeRender(this: any, render: () => DNode, properties: any, children: DNode[]): () => DNode {
		console.log('RENDER');
		const results = render();
		const dnode = findDNodeByKey(results, String(key));

		const showInvalidMsg = () => {
			console.log('SHOW');
			this.invalidTextShowing = true;
			this.invalidate();
		};

		const hideInvalidMsg = () => {
			console.log('HIDE');
			this.invalidTextShowing = false;
			this.invalidate();
		};

		const existingShowEvent = (dnode!.properties as any)[showEvent];
		const existingHideEvent = (dnode!.properties as any)[hideEvent];

		dnode && assign(dnode.properties, {
			[showEvent]: existingShowEvent ? after(existingShowEvent, showInvalidMsg) : showInvalidMsg,
			[hideEvent]: existingHideEvent ? after(existingHideEvent, hideInvalidMsg) : hideInvalidMsg
		});

		return () => results;
	}

	return handleDecorator(target => {
		target.invalidMsg = msg;
		target.validateBeforeRender = beforeRender;
		target.addDecorator('beforeRender', target.validateBeforeRender);
	});
}
