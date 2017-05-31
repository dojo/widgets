import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import Dialog, { DialogProperties } from '../../Dialog';
import * as css from '../../styles/dialog.m.css';
import * as animations from '../../../common/styles/animations.m.css';
import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty } from '@dojo/test-extras/support/d';
import { HNode } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import * as sinon from 'sinon';

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
		const spy = sinon.spy();
		dialog.setProperties({
			open: true,
			closeable: true,
			onRequestClose: spy
		});
		dialog.sendEvent('click', { selector: 'button'});
		assert.isTrue(spy.calledOnce, 'onRequestClose should be called when close button is clicked');
	},

	onOpen() {
		const spy = sinon.spy();
		dialog.setProperties({
			open: true,
			onOpen: spy
		});
		dialog.getRender(); // just to trigger a `_invalidate()`

		assert.isTrue(spy.calledOnce, 'onOpen should be called');
	},

	modal() {
		const spy = sinon.spy();
		dialog.setProperties({
			open: true,
			modal: true,
			onRequestClose: spy
		});
		dialog.sendEvent('click', { key: 'underlay' } );
		assert.isTrue(spy.notCalled, 'onRequestClose should not be called when underlay is clicked and modal is true');

		dialog.setProperties({
			open: true,
			modal: false,
			onRequestClose: spy
		});
		dialog.getRender(); // just to trigger a `_invalidate()`
		dialog.sendEvent('click', { key: 'underlay' } );
		assert.isTrue(spy.calledOnce, 'onRequestClose should be called if underlay is clicked and modal is false');
	},

	closeable() {
		dialog.setProperties({
			open: true,
			closeable: false
		});

		const expected = v('div', {
			classes: dialog.classes(css.root)
		}, [
			v('div', {
				classes: dialog.classes(css.underlay),
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
				}, [ '', null ]),
				v('div', {
					classes: dialog.classes(css.content),
					key: 'content',
					afterCreate: dialog.listener,
					afterUpdate: dialog.listener
				}, [])
			])

		]);
		dialog.expectRender(expected);
	}
});
