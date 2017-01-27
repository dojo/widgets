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
				open: false,
				title: 'dialog',
				underlay: true,
				closeable: true
			}
		});
		assert.strictEqual(dialog.properties.id, 'foo');
		assert.isTrue(dialog.properties.modal);
		assert.isFalse(dialog.properties.open);
		assert.strictEqual(dialog.properties.title, 'dialog');
		assert.isTrue(dialog.properties.underlay);
		assert.isTrue(dialog.properties.closeable);
	},

	render() {
		const dialog = createDialog({
			properties: {
				id: 'foo',
				open: true,
				underlay: true,
				enterAnimation: 'enter',
				exitAnimation: 'exit'
			}
		});
		const vnode = <VNode> dialog.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.strictEqual(vnode.properties!['data-widget-id'], 'foo');
		assert.strictEqual(vnode.properties!['data-underlay'], 'true');
		assert.strictEqual(vnode.properties!['data-open'], 'true');
		vnode.children && assert.strictEqual(vnode.children[1].properties!['enterAnimation'], 'enter');
		vnode.children && assert.strictEqual(vnode.children[1].properties!['exitAnimation'], 'exit');
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
	},

	closeable() {
		const dialog = createDialog({
			properties: {
				closeable: false,
				open: true
			}
		});

		dialog.onCloseClick && dialog.onCloseClick();
		assert.isTrue(dialog.properties.open);
	}
});
