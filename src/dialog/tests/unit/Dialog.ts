import * as registerSuite from 'intern!object';
import * as sinon from 'sinon';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Dialog from '../../Dialog';
import * as css from '../../styles/dialog.m.css';

registerSuite({
	name: 'Dialog',

	'Should construct dialog with passed properties'() {
		const dialog = new Dialog();
		dialog.__setProperties__({
			key: 'foo',
			modal: true,
			open: true,
			title: 'dialog',
			underlay: true,
			closeable: true,
			closeText: 'foo',
			role: 'dialog'
		});

		assert.strictEqual(dialog.properties.key, 'foo');
		assert.isTrue(dialog.properties.modal);
		assert.isTrue(dialog.properties.open);
		assert.strictEqual(dialog.properties.title, 'dialog');
		assert.isTrue(dialog.properties.underlay);
		assert.isTrue(dialog.properties.closeable);
		assert.strictEqual(dialog.properties.closeText, 'foo');
		assert.strictEqual(dialog.properties.role, 'dialog');
	},

	'Render correct children'() {
		const dialog = new Dialog();
		dialog.__setProperties__({
			enterAnimation: 'enter',
			exitAnimation: 'exit',
			role: 'dialog',
			closeText: 'foo'
		});
		let vnode = <VNode> dialog.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'div', 'tagname should be div');
		assert.property(vnode.properties!.classes!, css.root);
		assert.lengthOf(vnode.children, 0);

		dialog.__setProperties__({
			open: true,
			underlay: true,
			role: 'dialog'
		});
		vnode = <VNode> dialog.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	onRequestClose() {
		const dialog = new Dialog();
		dialog.__setProperties__({
			open: true,
			onRequestClose: () => {
				dialog.__setProperties__({ open: false });
			}
		});
		(<any> dialog)._onCloseClick();

		assert.isFalse(dialog.properties.open, 'onRequestClose should be called when close button is clicked');
	},

	onOpen() {
		const onOpen = sinon.spy();

		const dialog = new Dialog();
		dialog.__setProperties__({
			open: true,
			onOpen
		});
		<VNode> dialog.__render__();

		assert.isTrue(onOpen.called, 'onOpen should be called');
	},

	modal() {
		const dialog = new Dialog();
		dialog.__setProperties__({
			open: true,
			modal: true,
			onRequestClose: () => {
				dialog.__setProperties__({ open: false });
			}
		});
		(<any> dialog)._onUnderlayClick();

		assert.isTrue(dialog.properties.open, 'dialog should stay open when underlay is clicked and modal is true');

		dialog.__setProperties__({ modal: false });
		(<any> dialog)._onUnderlayClick();

		assert.isUndefined(dialog.properties.open, 'dialog should close if underlay is clicked and modal is false');
	},

	closeable() {
		const dialog = new Dialog();
		dialog.__setProperties__({
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
