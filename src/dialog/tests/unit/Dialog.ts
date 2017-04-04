import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Dialog from '../../Dialog';

registerSuite({
	name: 'Dialog',

	'Should construct dialog with passed properties'() {
		const dialog = new Dialog();
		dialog.setProperties({
			key: 'foo',
			modal: true,
			open: true,
			title: 'dialog',
			underlay: true,
			closeable: true,
			role: 'dialog'
		});

		assert.strictEqual(dialog.properties.key, 'foo');
		assert.isTrue(dialog.properties.modal);
		assert.isTrue(dialog.properties.open);
		assert.strictEqual(dialog.properties.title, 'dialog');
		assert.isTrue(dialog.properties.underlay);
		assert.isTrue(dialog.properties.closeable);
		assert.strictEqual(dialog.properties.role, 'dialog');
	},

	'Render correct children'() {
		const dialog = new Dialog();
		dialog.setProperties({
			enterAnimation: 'enter',
			exitAnimation: 'exit',
			role: 'dialog'
		});
		let vnode = <VNode> dialog.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'div', 'tagname should be div');
		assert.lengthOf(vnode.children, 0);

		dialog.setProperties({
			open: true,
			underlay: true,
			role: 'dialog'
		});
		vnode = <VNode> dialog.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	onClose() {
		const dialog = new Dialog();
		dialog.setProperties({
			open: true,
			onClose: () => {
				dialog.setProperties({ open: false });
			}
		});
		(<any> dialog)._onCloseClick();

		assert.isFalse(dialog.properties.open, 'onClose should be called when close button is clicked');
	},

	onOpen() {
		let called = false;

		const dialog = new Dialog();
		dialog.setProperties({
			open: true,
			onOpen: () => {
				called = true;
			}
		});
		<VNode> dialog.__render__();

		assert.isTrue(called, 'onOpen should be called');
	},

	modal() {
		const dialog = new Dialog();
		dialog.setProperties({
			open: true,
			modal: true,
			onClose: () => {
				dialog.setProperties({ open: false });
			}
		});
		(<any> dialog)._onUnderlayClick();

		assert.isTrue(dialog.properties.open, 'dialog should stay open when underlay is clicked and modal is true');

		dialog.setProperties({ modal: false });
		(<any> dialog)._onUnderlayClick();

		assert.isUndefined(dialog.properties.open, 'dialog should close if underlay is clicked and modal is false');
	},

	closeable() {
		const dialog = new Dialog();
		dialog.setProperties({
			closeable: false,
			open: true,
			title: 'foo'
		});
		const vnode = <VNode> dialog.__render__();
		(<any> dialog)._onCloseClick();

		assert.isTrue(dialog.properties.open, 'dialog should not close if closeable is false');
		assert.isUndefined(vnode.children![1].children![0].children, 'close button should not render if closeable is false');
	}
});
