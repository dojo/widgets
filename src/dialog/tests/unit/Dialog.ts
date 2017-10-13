const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { v } from '@dojo/widget-core/d';
import { assignChildProperties, compareProperty, replaceChild } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Dialog, { DialogProperties } from '../../Dialog';
import * as css from '../../styles/dialog.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';
import * as animations from '../../../common/styles/animations.m.css';

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

const expectedCloseButton = function(widget: any) {
	return v('button', {
		classes: widget.classes(css.close),
		onclick: widget.listener
	}, [
		'close dialog',
		v('i', {
			classes: widget.classes(iconCss.icon, iconCss.closeIcon),
			role: 'presentation',
			'aria-hidden': 'true'
		})
	]);
};

const expected = function(widget: any, open = false, closeable = false, children: any[] = []) {
	return v('div', { classes: widget.classes(css.root) }, open ? [
		v('div', {
			classes: widget.classes(css.underlay),
			enterAnimation: animations.fadeIn,
			exitAnimation: animations.fadeOut,
			key: 'underlay',
			onclick: widget.listener
		}),
		v('div', {
			'aria-labelledby': compareId,
			classes: widget.classes(css.main),
			enterAnimation: animations.fadeIn,
			exitAnimation: animations.fadeOut,
			key: 'main',
			role: 'dialog'
		}, [
			v('div', {
				classes: widget.classes(css.title),
				key: 'title'
			}, [
				v('div', { id: <any> compareId }, [ '' ]),
				closeable ? expectedCloseButton(widget) : null
			]),
			v('div', {
				classes: widget.classes(css.content),
				key: 'content'
			}, children)
		])
	] : []);
};

let widget: Harness<DialogProperties, typeof Dialog>;

registerSuite('Dialog', {

	beforeEach() {
		widget = harness(Dialog);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'default properties'() {
			widget.expectRender(expected(widget), 'closed dialog renders correctly');

			widget.setProperties({
				open: true,
				closeable: false
			});
			widget.expectRender(expected(widget, true), 'open dialog renders correctly');
		},

		'custom properties'() {
			// force an initial render so all classes are present
			widget.setProperties({
				open: true
			});
			widget.getRender();

			// set tested properties
			widget.setProperties({
				closeable: true,
				closeText: 'foo',
				enterAnimation: 'fooAnimation',
				exitAnimation: 'barAnimation',
				open: true,
				role: 'alertdialog',
				title: 'foo',
				underlay: true
			});

			let expectedVdom = expected(widget, true, true);
			assignChildProperties(expectedVdom, '0', {
				classes: widget.classes(css.underlayVisible, css.underlay) // do this here so the class is present in future renders
			});
			expectedVdom = expected(widget, true, true);
			replaceChild(expectedVdom, '1,0,1,0', 'foo');
			replaceChild(expectedVdom, '1,0,0,0', 'foo');
			assignChildProperties(expectedVdom, '0', {
				classes: widget.classes(css.underlayVisible, css.underlay)
			});
			assignChildProperties(expectedVdom, '1', {
				enterAnimation: 'fooAnimation',
				exitAnimation: 'barAnimation',
				role: 'alertdialog'
			});

			widget.expectRender(expectedVdom);
		},

		children() {
			const testChildren = [
				v('p', [ 'Lorem ipsum dolor sit amet' ]),
				v('a', { href: '#foo' }, [ 'foo' ])
			];

			widget.setProperties({
				open: true
			});
			widget.setChildren(testChildren);

			const expectedVdom = expected(widget, true, true, testChildren);
			widget.expectRender(expectedVdom);
		},

		onRequestClose() {
			const onRequestClose = sinon.stub();

			widget.setProperties({
				closeable: true,
				open: true,
				onRequestClose
			});
			widget.sendEvent('click', {
				selector: `.${css.close}`
			});
			assert.isTrue(onRequestClose.calledOnce, 'onRequestClose handler called when close button is clicked');

			widget.setProperties({
				closeable: false,
				open: true,
				onRequestClose
			});
			widget.getRender();
			widget.sendEvent('click', {
				selector: `.${css.underlay}`
			});
			assert.isTrue(onRequestClose.calledOnce, 'onRequestClose handler not called when closeable is false');
		},

		onOpen() {
			const onOpen = sinon.stub();

			widget.setProperties({
				open: true,
				onOpen
			});
			widget.getRender();
			assert.isTrue(onOpen.calledOnce, 'onOpen handler called when open is initially set to true');

			widget.setProperties({
				closeable: true,
				open: true,
				onOpen
			});
			widget.getRender();
			assert.isTrue(onOpen.calledOnce, 'onOpen handler not called if dialog was previously open');
		},

		modal() {
			const onRequestClose = sinon.stub();

			widget.setProperties({
				open: true,
				modal: true,
				onRequestClose
			});

			widget.sendEvent('click', {
				selector: `.${css.underlay}`
			});
			assert.isFalse(onRequestClose.called, 'onRequestClose should not be called when the underlay is clicked and modal is true');

			widget.setProperties({
				open: true,
				modal: false,
				onRequestClose
			});
			widget.getRender();

			widget.sendEvent('click', {
				selector: `.${css.underlay}`
			});
			assert.isTrue(onRequestClose.called, 'onRequestClose is called when the underlay is clicked and modal is false');
		}
	}
});
