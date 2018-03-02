const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import { v, w, isWNode } from '@dojo/widget-core/d';
import harness from '@dojo/test-extras/harness';
import { stub } from 'sinon';

import Icon from '../../../icon/index';
import Toolbar, { Position, ToolbarProperties } from '../../index';
import SlidePane, { Align } from '../../../slide-pane/index';

import * as fixedCss from '../../styles/toolbar.m.css';
import * as css from '../../../theme/toolbar.m.css';
import { GlobalEvent } from '../../../global-event/index';
import { noop, MockMetaMixin, stubEvent } from '../../../common/tests/support/test-helpers';

registerSuite('Toolbar', {
	tests: {
		'default rendering'() {
			const h = harness(() => w(Toolbar, {}));
			h.expect(() => v('div', {
				key: 'root',
				lang: null,
				classes: fixedCss.containerFixed,
				dir: '',
				styles: {}
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'toolbar'
				}, [
					null,
					null,
					null
				])
			]));
		},

		'bottom-positioned rendering'() {
			const h = harness(() => w(Toolbar, {
				fixed: true,
				position: Position.bottom
			}));

			h.expect(() => v('div', {
				key: 'root',
				lang: null,
				classes: fixedCss.containerFixed,
				dir: '',
				styles: {
					height: `0px`
				}
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.root,
						null,
						css.sticky,
						fixedCss.rootFixed,
						fixedCss.stickyFixed,
						fixedCss.onBottomFixed
					],
					key: 'toolbar'
				}, [
					null,
					null,
					null
				])
			]));
		},

		'bottom-position rendering without `fixed: true`'() {
			stub(console, 'warn');
			const h = harness(() => w(Toolbar, {
				fixed: false,
				position: Position.bottom
			}));

			h.expect(() => v('div', {
				key: 'root',
				lang: null,
				classes: fixedCss.containerFixed,
				dir: '',
				styles: {}
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'toolbar'
				}, [
					null,
					null,
					null
				])
			]));

			assert.isTrue((console as any).warn.calledWith('Bottom positioning can be used only when `fixed` is `true`.'));
			(console as any).warn.restore();
		},

		'expanded rendering'() {
			const mockMeta = stub();
			const mockDimensionsGet = stub();
			mockDimensionsGet.returns({
				offset: { height: 100, left: 100, top: 100, width: 100 },
				position: { bottom: 200, left: 100, right: 200, top: 100 },
				scroll: { height: 100, left: 100, top: 100, width: 100 },
				size: { width: 100, height: 100 }
			});
			mockMeta.withArgs(Dimensions).returns({
				get: mockDimensionsGet
			});

			const h = harness(() => w(MockMetaMixin(Toolbar, mockMeta), { collapseWidth: 10 }));

			h.expect(() => v('div', {
				key: 'root',
				lang: null,
				classes: fixedCss.containerFixed,
				dir: '',
				styles: {}
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'toolbar'
				}, [
					null,
					null,
					null
				])
			]));
		},

		'fixed rendering'() {
			const h = harness(() => w(Toolbar, { fixed: true }));

			h.expect(() => v('div', {
				key: 'root',
				lang: null,
				classes: fixedCss.containerFixed,
				dir: '',
				styles: {
					height: `0px`
				}
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.root,
						null,
						css.sticky,
						fixedCss.rootFixed,
						fixedCss.stickyFixed,
						fixedCss.onTopFixed
					],
					key: 'toolbar'
				}, [
					null,
					null,
					null
				])
			]));
		},

		'custom title rendering'() {
			const h = harness(() => w(Toolbar, { heading: 'test' }));
			h.expect(() => v('div', {
				key: 'root',
				lang: null,
				classes: fixedCss.containerFixed,
				dir: '',
				styles: {}
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'toolbar'
				}, [
					v('div', {
						classes: [ css.title, fixedCss.titleFixed ]
					}, [ 'test' ]),
					null,
					null
				])
			]));
		},

		'actions rendering'() {
			const h = harness(() => w(Toolbar, {}, [ 'test' ]));
			h.expect(() => v('div', {
				key: 'root',
				lang: null,
				classes: fixedCss.containerFixed,
				dir: '',
				styles: {}
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'toolbar'
				}, [
					null,
					v('div', {
						classes: [ css.actions, fixedCss.actionsFixed ],
						key: 'menu'
					}, [
						'test'
					]),
					null
				])
			]));
		},

		'open and close menu'() {
			const mockMeta = stub();
			const mockDimensionsGet = stub();
			mockDimensionsGet.returns({
				offset: { height: 100, left: 100, top: 100, width: 100 },
				position: { bottom: 200, left: 100, right: 200, top: 100 },
				scroll: { height: 100, left: 100, top: 100, width: 100 },
				size: { width: 100, height: 100 }
			});
			mockMeta.withArgs(Dimensions).returns({
				get: mockDimensionsGet
			});
			let properties: ToolbarProperties = {
				collapseWidth: 1000,
				onCollapse: () => {}
			};
			const h = harness(() => w(MockMetaMixin(Toolbar, mockMeta), properties, [ 'test' ]));
			const slidePaneVDom = w(SlidePane, {
				align: Align.right,
				closeText: 'close',
				key: 'slide-pane-menu',
				onRequestClose: noop,
				open: false,
				theme: undefined,
				title: 'foo'
			}, [
				'test'
			]);

			const buttonVDom = v('button', {
				classes: [ css.menuButton, fixedCss.menuButtonFixed ],
				type: 'button',
				onclick: noop
			}, [
				'open',
				w(Icon, { type: 'barsIcon' })
			]);

			h.expect(() => v('div', {
				key: 'root',
				lang: null,
				classes: fixedCss.containerFixed,
				dir: '',
				styles: {}
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'toolbar'
				}, [
					null,
					v('div', {
						classes: [ css.actions, fixedCss.actionsFixed ],
						key: 'menu'
					}, [
						'test'
					]),
					null
				])
			]));

			properties = { heading: 'foo' };
			h.trigger('@global', (node: any) => {
				if (isWNode<GlobalEvent>(node) && node.properties.window !== undefined) {
					return node.properties.window ? node.properties.window.resize : undefined;
				}
			});

			h.expect(() => v('div', {
				key: 'root',
				lang: null,
				classes: fixedCss.containerFixed,
				dir: '',
				styles: {}
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.root,
						css.collapsed,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'toolbar'
				}, [
					v('div', {
						classes: [ css.title, fixedCss.titleFixed ]
					}, [ 'foo' ]),
					slidePaneVDom,
					buttonVDom
				])
			]));

			h.trigger(`.${css.menuButton}`, 'onclick', stubEvent);
			h.trigger('@slide-pane-menu', 'onRequestClose');

			h.expect(() => v('div', {
				key: 'root',
				lang: null,
				classes: fixedCss.containerFixed,
				dir: '',
				styles: {}
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.root,
						css.collapsed,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'toolbar'
				}, [
					v('div', {
						classes: [ css.title, fixedCss.titleFixed ]
					}, [ 'foo' ]),
					slidePaneVDom,
					buttonVDom
				])
			]));
		}
	}
});
