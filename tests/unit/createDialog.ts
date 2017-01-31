import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import createDialog from '../../src/components/dialog/createDialog';

registerSuite({
	name: 'createDialog',

	construction() {
		const dialog = createDialog({
			properties: {
				id: 'foo',
				modal: true,
				open: true,
				title: 'dialog',
				underlay: true,
				closeable: true
			}
		});
		assert.strictEqual(dialog.properties.id, 'foo');
		assert.isTrue(dialog.properties.modal);
		assert.isTrue(dialog.properties.open);
		assert.strictEqual(dialog.properties.title, 'dialog');
		assert.isTrue(dialog.properties.underlay);
		assert.isTrue(dialog.properties.closeable);
	},

	nodeAttributes() {
		const dialog = createDialog({
			properties: {
				enterAnimation: 'enter',
				exitAnimation: 'exit'
			}
		});
		let vnode = <VNode> dialog.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.strictEqual(vnode.properties!['data-underlay'], 'false');
		assert.strictEqual(vnode.properties!['data-open'], 'false');

		dialog.setProperties({
			open: true,
			underlay: true
		});
		vnode = <VNode> dialog.__render__();
		assert.strictEqual(vnode.properties!['data-underlay'], 'true');
		assert.strictEqual(vnode.properties!['data-open'], 'true');
		assert.lengthOf(vnode.children, 2);
	},

	onRequestClose() {
		const dialog = createDialog({
			properties: {
				open: true,
				onRequestClose: () => {
					dialog.setProperties({ open: false });
				}
			}
		});

		dialog.onCloseClick && dialog.onCloseClick();
		assert.isFalse(dialog.properties.open);
	},

	onOpen() {
		let called = false;

		const dialog = createDialog({
			properties: {
				open: true,
				onOpen: () => {
					called = true;
				}
			}
		});
		<VNode> dialog.__render__();
		assert.isTrue(called);
	},

	modal() {
		const dialog = createDialog({
			properties: {
				open: true,
				modal: true,
				onRequestClose: () => {
					dialog.setProperties({ open: false });
				}
			}
		});

		dialog.onUnderlayClick && dialog.onUnderlayClick();
		assert.isTrue(dialog.properties.open);

		dialog.setProperties({ modal: false });
		dialog.onUnderlayClick && dialog.onUnderlayClick();
		assert.isUndefined(dialog.properties.open);
	},

	closeable() {
		const dialog = createDialog({
			properties: {
				closeable: false,
				open: true,
				title: 'foo'
			}
		});

		dialog.onCloseClick && dialog.onCloseClick();
		assert.isTrue(dialog.properties.open);

		const vnode = <VNode> dialog.__render__();
		assert.isUndefined(vnode.children![1].children![0].children);
	}
});
