import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import createDialog from '../../../src/components/dialog/createDialog';

registerSuite({
	name: 'createDialog',

	'Should construct dialog with passed properties'() {
		const dialog = createDialog({
			properties: {
				id: 'foo',
				modal: true,
				open: true,
				title: 'dialog',
				underlay: true,
				closeable: true,
				role: 'dialog'
			}
		});

		assert.strictEqual(dialog.properties.id, 'foo');
		assert.isTrue(dialog.properties.modal);
		assert.isTrue(dialog.properties.open);
		assert.strictEqual(dialog.properties.title, 'dialog');
		assert.isTrue(dialog.properties.underlay);
		assert.isTrue(dialog.properties.closeable);
		assert.strictEqual(dialog.properties.role, 'dialog');
	},

	'Outer node should have correct attribues'() {
		const dialog = createDialog({
			properties: {
				enterAnimation: 'enter',
				exitAnimation: 'exit',
				role: 'dialog'
			}
		});
		let vnode = <VNode> dialog.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'div', 'tagname should be div');
		assert.strictEqual(vnode.properties!['data-underlay'], 'false');
		assert.strictEqual(vnode.properties!['data-open'], 'false');

		dialog.setProperties({
			open: true,
			underlay: true,
			role: 'alert'
		});
		vnode = <VNode> dialog.__render__();

		assert.strictEqual(vnode.properties!['data-underlay'], 'true');
		assert.strictEqual(vnode.properties!['data-open'], 'true');
		assert.strictEqual(vnode.children![1].properties!['role'], 'alertdialog');
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
		dialog.onCloseClick();

		assert.isFalse(dialog.properties.open, 'onRequestClose should be called when close button is clicked');
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

		assert.isTrue(called, 'onOpen should be called');
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
		dialog.onUnderlayClick();

		assert.isTrue(dialog.properties.open, 'dialog should stay open when underlay is clicked and modal is true');

		dialog.setProperties({ modal: false });
		dialog.onUnderlayClick();

		assert.isUndefined(dialog.properties.open, 'dialog should close if underlay is clicked and modal is false');
	},

	closeable() {
		const dialog = createDialog({
			properties: {
				closeable: false,
				open: true,
				title: 'foo'
			}
		});
		const vnode = <VNode> dialog.__render__();
		dialog.onCloseClick();

		assert.isTrue(dialog.properties.open, 'dialog should not close if closeable is false');
		assert.isUndefined(vnode.children![1].children![0].children, 'close button should not render if closeable is false');
	}
});
