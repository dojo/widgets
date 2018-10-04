const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { v, w, isWNode } from '@dojo/framework/widget-core/d';
import Focus from '@dojo/framework/widget-core/meta/Focus';

import Dialog, { DialogProperties } from '../../index';
import Icon from '../../../icon/index';
import * as css from '../../../theme/dialog.m.css';
import * as fixedCss from '../../styles/dialog.m.css';
import { Keys } from '../../../common/util';
import { GlobalEvent } from '../../../global-event/index';
import {
	createHarness,
	compareId,
	compareAriaLabelledBy,
	MockMetaMixin,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';

const harness = createHarness([ compareId, compareAriaLabelledBy ]);

const expectedCloseButton = function() {
	return v('button', {
		classes: css.close,
		type: 'button',
		onclick: noop
	}, [
		'close ',
		w(Icon, { type: 'closeIcon', theme: undefined })
	]);
};

const expected = function(open = false, closeable = false, children: any[] = []) {
	return v('div', {
		classes: css.root
	}, open ? [
		w(GlobalEvent, {
			key: 'global',
			document: {
				keyup: noop
			}
		}),
		v('div', {
			classes: [ null, fixedCss.underlay ],
			enterAnimation: css.underlayEnter,
			exitAnimation: css.underlayExit,
			key: 'underlay',
			onclick: noop
		}),
		v('div', {
			'aria-labelledby': '',
			classes: css.main,
			enterAnimation: css.enter,
			exitAnimation: css.exit,
			key: 'main',
			role: 'dialog',
			tabIndex: -1
		}, [
			v('div', {
				classes: css.title,
				key: 'title'
			}, [
				v('div', { id: '' }, [ '' ]),
				closeable ? expectedCloseButton() : null
			]),
			v('div', {
				classes: css.content,
				key: 'content'
			}, children)
		])
	] : []);
};

registerSuite('Dialog', {

	tests: {
		'default properties'() {
			let properties: DialogProperties = {};
			const h = harness(() => w(Dialog, properties));
			h.expect(expected);

			properties = {
				open: true,
				closeable: false
			};
			h.expect(() => expected(true));
		},

		'custom properties'() {
			let properties: DialogProperties = {
				open: true
			};
			const h = harness(() => w(Dialog, properties));

			// set tested properties
			properties = {
				aria: { describedBy: 'foo' },
				closeable: true,
				closeText: 'foo',
				enterAnimation: 'fooAnimation',
				exitAnimation: 'barAnimation',
				open: true,
				role: 'alertdialog',
				title: 'foo',
				underlay: true
			};

			h.expect(() => v('div', {
				classes: css.root
			}, [
				w(GlobalEvent, {
					key: 'global',
					document: {
						keyup: noop
					}
				}),
				v('div', {
					classes: [ css.underlayVisible, fixedCss.underlay ],
					enterAnimation: css.underlayEnter,
					exitAnimation: css.underlayExit,
					key: 'underlay',
					onclick: noop
				}),
				v('div', {
					role: 'alertdialog',
					'aria-describedby': 'foo',
					'aria-labelledby': '',
					classes: css.main,
					enterAnimation: 'fooAnimation',
					exitAnimation: 'barAnimation',
					key: 'main',
					tabIndex: -1
				}, [
					v('div', {
						classes: css.title,
						key: 'title'
					}, [
						v('div', { id: '' }, [ 'foo' ]),
						v('button', {
							classes: css.close,
							type: 'button',
							onclick: noop
						}, [
							'foo',
							w(Icon, { type: 'closeIcon', theme: undefined })
						])
					]),
					v('div', {
						classes: css.content,
						key: 'content'
					}, [])
				])
			]));
		},

		'correct close text'() {
			const h = harness(() => w(Dialog, {
				closeable: true,
				open: true,
				title: 'foo'
			}));
			h.expect(() => v('div', {
				classes: css.root
			}, [
				w(GlobalEvent, {
					key: 'global',
					document: {
						keyup: noop
					}
				}),
				v('div', {
					classes: [ null, fixedCss.underlay ],
					enterAnimation: css.underlayEnter,
					exitAnimation: css.underlayExit,
					key: 'underlay',
					onclick: noop
				}),
				v('div', {
					role: 'dialog',
					'aria-labelledby': '',
					classes: css.main,
					enterAnimation: css.enter,
					exitAnimation: css.exit,
					key: 'main',
					tabIndex: -1
				}, [
					v('div', {
						classes: css.title,
						key: 'title'
					}, [
						v('div', { id: '' }, [ 'foo' ]),
						v('button', {
							classes: css.close,
							type: 'button',
							onclick: noop
						}, [
							'close foo',
							w(Icon, { type: 'closeIcon', theme: undefined })
						])
					]),
					v('div', {
						classes: css.content,
						key: 'content'
					}, [])
				])
			]));
		},

		children() {
			const h = harness(() => w(Dialog, { open: true }, [
				v('p', [ 'Lorem ipsum dolor sit amet' ]),
				v('a', { href: '#foo' }, [ 'foo' ])
			]));

			h.expect(() => expected(true, true, [
				v('p', [ 'Lorem ipsum dolor sit amet' ]),
				v('a', { href: '#foo' }, [ 'foo' ])
			]));
		},

		onRequestClose() {
			const onRequestClose = sinon.stub();
			let properties = {
				closeable: true,
				open: true,
				onRequestClose
			};
			const h = harness(() => w(Dialog, properties));
			h.trigger(`.${css.close}`, 'onclick', stubEvent);
			assert.isTrue(onRequestClose.calledOnce, 'onRequestClose handler called when close button is clicked');

			properties = {
				closeable: false,
				open: true,
				onRequestClose
			};
			h.trigger(`.${css.close}`, 'onclick', stubEvent);
			assert.isTrue(onRequestClose.calledOnce, 'onRequestClose handler not called when closeable is false');
		},

		onOpen() {
			const onOpen = sinon.stub();
			let properties: any = {
				open: true,
				onOpen
			};
			const h = harness(() => w(Dialog, properties));
			assert.isTrue(onOpen.calledOnce, 'onOpen handler called when open is initially set to true');

			properties = {
				closeable: true,
				open: true,
				onOpen
			};
			h.expect(() => expected(true, true));
			assert.isTrue(onOpen.calledOnce, 'onOpen handler not called if dialog was previously open');
		},

		modal() {
			const onRequestClose = sinon.stub();
			let properties: any = {
				open: true,
				modal: true,
				onRequestClose
			};
			const h = harness(() => w(Dialog, properties));
			h.trigger(`.${fixedCss.underlay}`, 'onclick', stubEvent);

			assert.isFalse(onRequestClose.called, 'onRequestClose should not be called when the underlay is clicked and modal is true');

			properties = {
				open: true,
				modal: false,
				onRequestClose
			};

			h.trigger(`.${fixedCss.underlay}`, 'onclick', stubEvent);
			assert.isTrue(onRequestClose.called, 'onRequestClose is called when the underlay is clicked and modal is false');
		},

		escapeKey() {
			const onRequestClose = sinon.stub();
			const h = harness(() => w(Dialog, {
				open: true,
				onRequestClose
			}));
			h.trigger('@global', (node: any) => {
				if (isWNode<GlobalEvent>(node) && node.properties.document !== undefined) {
					return node.properties.document.keyup;
				}
			}, { which: Keys.Down , ...stubEvent });
			assert.isTrue(onRequestClose.notCalled);
			h.trigger('@global', (node: any) => {
				if (isWNode<GlobalEvent>(node) && node.properties.document !== undefined) {
					return node.properties.document.keyup;
				}
			}, { which: Keys.Escape , ...stubEvent });
			assert.isTrue(onRequestClose.calledOnce);
		},

		focus: {
			'set initial focus'() {
				const mockMeta = sinon.stub();
				const mockFocusGet = sinon.stub().returns({
					active: false,
					containsFocus: false
				});
				const mockFocusSet = sinon.stub();
				mockMeta.withArgs(Focus).returns({
					get: mockFocusGet,
					set: mockFocusSet
				});
				const h = harness(() => w(MockMetaMixin(Dialog, mockMeta), { open: true }));
				assert.isTrue(mockFocusSet.calledOnce, 'focus set when dialog is opened');
			},

			'set initial focus only once'() {
				const mockMeta = sinon.stub();
				const mockFocusGet = sinon.stub().returns({
					active: true,
					containsFocus: true
				});
				const mockFocusSet = sinon.stub();
				mockMeta.withArgs(Focus).returns({
					get: mockFocusGet,
					set: mockFocusSet
				});
				const h = harness(() => w(MockMetaMixin(Dialog, mockMeta), { open: true }));
				assert.isFalse(mockFocusSet.called, 'focus not set when dialog is already focused');
			},

			'keep focus in modal dialog'() {
				const mockMeta = sinon.stub();
				const mockFocusGet = sinon.stub().returns({
					active: false,
					containsFocus: false
				});
				const mockFocusSet = sinon.stub();
				mockMeta.withArgs(Focus).returns({
					get: mockFocusGet,
					set: mockFocusSet
				});
				let properties: any = {
					open: true,
					modal: true
				};
				const h = harness(() => w(MockMetaMixin(Dialog, mockMeta), properties));
				assert.isTrue(mockFocusSet.calledOnce, 'focus set when dialog is opened');

				// force render
				properties = {
					open: true,
					modal: false
				};
				mockFocusGet.returns({
					active: true,
					containsFocus: true
				});
				mockFocusSet.reset();
				h.expect(() => expected(true, true));
				assert.isFalse(mockFocusSet.called, 'set focus not called when dialog contains focus');

				// force render
				properties = {
					open: true,
					modal: true
				};
				mockFocusGet.returns({
					active: false,
					containsFocus: false
				});
				h.expect(() => expected(true, true));
				assert.isTrue(mockFocusSet.calledOnce, 'focus set when dialog loses focus while open');
			},

			'close non-modal dialog when focus leaves'() {
				const mockMeta = sinon.stub();
				const mockFocusGet = sinon.stub().returns({
					active: false,
					containsFocus: false
				});
				const mockFocusSet = sinon.stub();
				mockMeta.withArgs(Focus).returns({
					get: mockFocusGet,
					set: mockFocusSet
				});
				const mockRequestClose = sinon.stub();
				let properties: any = {
					open: true,
					modal: false
				};
				const h = harness(() => w(MockMetaMixin(Dialog, mockMeta), properties));
				assert.isTrue(mockFocusSet.calledOnce, 'focus set when dialog is opened');

				// force render
				properties = {
					open: true,
					modal: true
				};
				mockFocusGet.returns({
					active: true,
					containsFocus: true
				});
				mockFocusSet.reset();
				h.expect(() => expected(true, true));
				assert.isFalse(mockFocusSet.called, 'set focus not called when dialog contains focus');

				// force render
				properties = {
					open: true,
					modal: false,
					onRequestClose: mockRequestClose
				};
				mockFocusGet.returns({
					active: false,
					containsFocus: false
				});
				h.expect(() => expected(true, true));
				assert.isTrue(mockRequestClose.calledOnce, 'onRequestClose called when focus leaves');
			}
		}
	}
});
