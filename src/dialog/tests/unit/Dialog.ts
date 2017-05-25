import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Dialog, { DialogProperties } from '../../Dialog';
import * as css from '../../styles/dialog.m.css';
import * as animations from '../../../common/styles/animations.m.css';
import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty } from '@dojo/test-extras/support/d';
import { HNode } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';

let dialog: Harness<DialogProperties, typeof Dialog>;

const idComparator = compareProperty((value) => {
	return typeof value === 'string';
});

registerSuite({
	name: 'Dialog',

	beforeEach() {
		dialog = harness(Dialog);
	},
	afterEach() {
		dialog.destroy();
	},

	'Should construct dialog with passed properties'() {
		dialog.setChildren(['dialog content']);
		dialog.setProperties({
			key: 'foo',
			modal: true,
			open: true,
			title: 'dialog',
			underlay: true,
			closeable: true,
			role: 'dialog'
		});

		const expected = v('div', {
			classes: dialog.classes(css.root)
		}, [
			v('div', {
				classes: dialog.classes(css.underlayVisible, css.underlay),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut,
				key: 'underlay',
				onclick: dialog.listener,
				afterCreate: dialog.listener,
				afterUpdate: dialog.listener
			}),
			v('div', {
				'aria-labelledby': idComparator,
				classes: dialog.classes(css.main),
				enterAnimation: animations.fadeIn,
				exitAnimation: animations.fadeOut,
				afterCreate: dialog.listener,
				afterUpdate: dialog.listener,
				key: 'main',
				role: 'dialog'
			}, [
				v('div', {
					classes: dialog.classes(css.title),
					id: <any> idComparator,
					key: 'title',
					afterCreate: dialog.listener,
					afterUpdate: dialog.listener
				}, [
					'dialog',
					v('button', {
						classes: dialog.classes(css.close),
						innerHTML: 'close dialog',
						onclick: dialog.listener
					})
				]),
				v('div', {
					classes: dialog.classes(css.content),
					key: 'content',
					afterCreate: dialog.listener,
					afterUpdate: dialog.listener
				}, ['dialog content'])
			])

		]);
		dialog.expectRender(expected);
	},

	'Render correct children'() {
		dialog.setProperties({
			enterAnimation: 'enter',
			exitAnimation: 'exit',
			role: 'dialog'
		});
		let vnode = <HNode> dialog.getRender();
		assert.lengthOf(vnode.children, 0);

		dialog.setProperties({
			open: true,
			underlay: true,
			role: 'dialog'
		});
		vnode = <HNode> dialog.getRender();
		assert.lengthOf(vnode.children, 2);
	},

	onRequestClose() {
		let called = false;
		dialog.setProperties({
			open: true,
			closeable: true,
			onRequestClose: () => called = true
		});
		dialog.sendEvent('click', { selector: 'button'});
		assert.isTrue(called, 'onRequestClose should be called when close button is clicked');
	},

	onOpen() {
		let called = false;

		dialog.setProperties({
			open: true,
			onOpen: () => {
				called = true;
			}
		});
		dialog.getRender(); // just to trigger a `_invalidate()`

		assert.isTrue(called, 'onOpen should be called');
	},

	modal() {
		let called = false;
		dialog.setProperties({
			open: true,
			modal: true,
			onRequestClose: () => called = true
		});
		dialog.sendEvent('click', { key: 'underlay' } );
		assert.isFalse(called, 'onRequestClose should not be called when underlay is clicked and modal is true');

		dialog.setProperties({
			open: true,
			modal: false,
			onRequestClose: () => called = true
		});
		dialog.getRender(); // just to trigger a `_invalidate()`
		dialog.sendEvent('click', { key: 'underlay' } );
		assert.isTrue(called, 'onRequestClose should be called if underlay is clicked and modal is false');
	},

	closeable() {
		// this test can not be converted using `test-extras` because there's no way to use `callListener` or `sendEvent` without the close button being rendered
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
