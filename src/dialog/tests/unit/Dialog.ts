const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import * as sinon from 'sinon';

import { v, w, isWNode } from '@dojo/widget-core/d';

import Dialog, { DialogProperties } from '../../Dialog';
import * as css from '../../../theme/dialog/dialog.m.css';
import * as fixedCss from '../../styles/dialog.m.css';
import * as iconCss from '../../../theme/common/icons.m.css';
import * as animations from '../../../common/styles/animations.m.css';
import { Keys } from '../../../common/util';
import { GlobalEvent } from '../../../global-event/GlobalEvent';
import {
	createHarness,
	compareId,
	compareAriaLabelledBy,
	noop
} from '../../../common/tests/support/test-helpers';

const harness = createHarness([ compareId, compareAriaLabelledBy ]);

const expectedCloseButton = function() {
	return v('button', {
		classes: css.close,
		onclick: noop
	}, [
		'close ',
		v('i', {
			classes: [ iconCss.icon, iconCss.closeIcon ],
			role: 'presentation',
			'aria-hidden': 'true'
		})
	]);
};

const expected = function(open = false, closeable = false, children: any[] = []) {
	return v('div', {
		classes: css.root,
		dir: null,
		lang: null
	}, open ? [
		w(GlobalEvent, {
			key: 'global',
			document: {
				keyup: noop
			}
		}),
		v('div', {
			classes: [ null, fixedCss.underlay ],
			enterAnimation: animations.fadeIn,
			exitAnimation: animations.fadeOut,
			key: 'underlay',
			onclick: noop
		}),
		v('div', {
			'aria-labelledby': '',
			classes: css.main,
			enterAnimation: animations.fadeIn,
			exitAnimation: animations.fadeOut,
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
			h.trigger('', '');

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
				classes: css.root,
				dir: null,
				lang: null
			}, [
				w(GlobalEvent, {
					key: 'global',
					document: {
						keyup: noop
					}
				}),
				v('div', {
					classes: [ css.underlayVisible, fixedCss.underlay ],
					enterAnimation: animations.fadeIn,
					exitAnimation: animations.fadeOut,
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
							onclick: noop
						}, [
							'foo',
							v('i', {
								classes: [ iconCss.icon, iconCss.closeIcon ],
								role: 'presentation',
								'aria-hidden': 'true'
							})
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
				classes: css.root,
				dir: null,
				lang: null
			}, [
				w(GlobalEvent, {
					key: 'global',
					document: {
						keyup: noop
					}
				}),
				v('div', {
					classes: [ null, fixedCss.underlay ],
					enterAnimation: animations.fadeIn,
					exitAnimation: animations.fadeOut,
					key: 'underlay',
					onclick: noop
				}),
				v('div', {
					role: 'dialog',
					'aria-labelledby': '',
					classes: css.main,
					enterAnimation: animations.fadeIn,
					exitAnimation: animations.fadeOut,
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
							onclick: noop
						}, [
							'close foo',
							v('i', {
								classes: [ iconCss.icon, iconCss.closeIcon ],
								role: 'presentation',
								'aria-hidden': 'true'
							})
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
			h.trigger(`.${css.close}`, 'onclick');
			assert.isTrue(onRequestClose.calledOnce, 'onRequestClose handler called when close button is clicked');

			properties = {
				closeable: false,
				open: true,
				onRequestClose
			};
			h.trigger(`.${css.close}`, 'onclick');
			assert.isTrue(onRequestClose.calledOnce, 'onRequestClose handler not called when closeable is false');
		},

		onOpen() {
			const onOpen = sinon.stub();
			let properties: any = {
				open: true,
				onOpen
			};
			const h = harness(() => w(Dialog, properties));
			h.trigger('', '');
			assert.isTrue(onOpen.calledOnce, 'onOpen handler called when open is initially set to true');

			properties = {
				closeable: true,
				open: true,
				onOpen
			};
			h.trigger('', '');
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
			h.trigger(`.${fixedCss.underlay}`, 'onclick');

			assert.isFalse(onRequestClose.called, 'onRequestClose should not be called when the underlay is clicked and modal is true');

			properties = {
				open: true,
				modal: false,
				onRequestClose
			};

			h.trigger(`.${fixedCss.underlay}`, 'onclick');
			assert.isTrue(onRequestClose.called, 'onRequestClose is called when the underlay is clicked and modal is false');
		},

		escapeKey() {
			const onRequestClose = sinon.stub();
			const h = harness(() => w(Dialog, {
				open: true,
				onRequestClose
			}));
			h.trigger(`@global`, (node: any) => {
				if (isWNode<GlobalEvent>(node) && node.properties.document !== undefined) {
					return node.properties.document.keyup;
				}
			}, { which: Keys.Down });
			assert.isTrue(onRequestClose.notCalled);
			h.trigger(`@global`, (node: any) => {
				if (isWNode<GlobalEvent>(node) && node.properties.document !== undefined) {
					return node.properties.document.keyup;
				}
			}, { which: Keys.Escape });
			assert.isTrue(onRequestClose.calledOnce);
		}
	}
});
