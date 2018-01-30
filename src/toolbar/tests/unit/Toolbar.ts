const { registerSuite } = intern.getInterface('object');
import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import { v, w, isWNode } from '@dojo/widget-core/d';
import harness from '@dojo/test-extras/harness';
import { stub } from 'sinon';

import Toolbar, { Position, ToolbarProperties } from '../../Toolbar';
import SlidePane, { Align } from '../../../slidepane/SlidePane';

import * as fixedCss from '../../styles/toolbar.m.css';
import * as css from '../../../theme/toolbar/toolbar.m.css';
import * as iconCss from '../../../theme/common/icons.m.css';
import { GlobalEvent } from '../../../global-event/GlobalEvent';
import { noop, MockMetaMixin } from '../../../common/tests/support/test-helpers';

registerSuite('Toolbar', {
	tests: {
		'default rendering'() {
			const h = harness(() => w(Toolbar, {}));
			h.expect(() => v('div', {
				classes: [
					css.root,
					null,
					null,
					fixedCss.rootFixed,
					null,
					fixedCss.onTopFixed
				],
				key: 'root',
				dir: null,
				lang: null
			}, [
				w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
				v('div', {
					classes: [
						css.toolbar,
						fixedCss.toolbarFixed
					]
				}, [ null, null, null]),
				v('div', {
					classes: [
						css.content,
						fixedCss.contentFixed
					]
				}, [])
			]));
		},

		'bottom-positioned rendering'() {
			const h = harness(() => w(Toolbar, { position: Position.bottom }));
			h.expect(() =>
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onBottomFixed
					],
					key: 'root',
					dir: null,
					lang: null
				}, [
					w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
					v('div', {
						classes: [
							css.toolbar,
							fixedCss.toolbarFixed
						]
					}, [ null, null, null]),
					v('div', {
						classes: [
							css.content,
							fixedCss.contentFixed
						]
					}, [])
				]));
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

			h.expect(() =>
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'root',
					dir: null,
					lang: null
				}, [
					w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
					v('div', {
						classes: [
							css.toolbar,
							fixedCss.toolbarFixed
						]
					}, [ null, null, null]),
					v('div', {
						classes: [
							css.content,
							fixedCss.contentFixed
						]
					}, [])
				]));
		},

		'fixed rendering'() {
			const h = harness(() => w(Toolbar, { fixed: true }));
			h.expect(() =>
				v('div', {
					classes: [
						css.root,
						null,
						css.sticky,
						fixedCss.rootFixed,
						fixedCss.stickyFixed,
						undefined
					],
					key: 'root',
					dir: null,
					lang: null
				}, [
					w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
					v('div', {
						classes: [
							css.toolbar,
							fixedCss.toolbarFixed
						]
					}, [ null, null, null]),
					v('div', {
						classes: [
							css.content,
							fixedCss.contentFixed
						]
					}, [])
				]));
		},

		'custom title rendering'() {
			const h = harness(() => w(Toolbar, { title: 'test' }));
			h.expect(() =>
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'root',
					dir: null,
					lang: null
				}, [
					w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
					v('div', {
						classes: [
							css.toolbar,
							fixedCss.toolbarFixed
						]
					}, [
						v('div', {
							classes: [ css.title, fixedCss.titleFixed ]
						}, [ 'test' ]),
						null,
						null
					]),
					v('div', {
						classes: [
							css.content,
							fixedCss.contentFixed
						]
					}, [])
				]));
		},

		'actions rendering'() {
			const h = harness(() => w(Toolbar, { actions: [ 'test' ] }));
			h.expect(() =>
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'root',
					dir: null,
					lang: null
				}, [
					w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
					v('div', {
						classes: [
							css.toolbar,
							fixedCss.toolbarFixed
						]
					}, [
						null,
						v('div', {
							classes: [ css.actions, fixedCss.actionsFixed ],
							key: 'menu'
						}, [
							v('div', {
								classes: [ css.action ],
								key: 0
							}, [ 'test' ])
						]),
						null
					]),
					v('div', {
						classes: [
							css.content,
							fixedCss.contentFixed
						]
					}, [])
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
			const h = harness(() => w(MockMetaMixin(Toolbar, mockMeta), properties));
			const slidePaneVDom = w(SlidePane, {
				align: Align.right,
				closeText: 'close foo',
				key: 'slide-pane-menu',
				onRequestClose: noop,
				open: false,
				theme: undefined,
				title: 'foo'
			}, [
				v('div', {
					classes: [ css.action ],
					key: 0
				}, [ 'test' ])
			]);

			const buttonVDom = v('button', {
				classes: [ css.menuButton, fixedCss.menuButtonFixed ],
				onclick: noop
			}, [
				'open foo',
				v('i', {
					classes: [ iconCss.icon, iconCss.barsIcon ],
					role: 'presentation',
					'aria-hidden': 'true'
				})
			]);

			h.expect(() =>
				v('div', {
					classes: [
						css.root,
						null,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'root',
					dir: null,
					lang: null
				}, [
					w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
					v('div', {
						classes: [
							css.toolbar,
							fixedCss.toolbarFixed
						]
					}, [ null, null, null]),
					v('div', {
						classes: [
							css.content,
							fixedCss.contentFixed
						]
					}, [])
				]));

			properties = { actions: [ 'test' ], menuTitle: 'foo' };
			h.trigger('@global', (node: any) => {
				if (isWNode<GlobalEvent>(node) && node.properties.window !== undefined) {
					return node.properties.window ? node.properties.window.resize : undefined;
				}
			});
			h.expect(() =>
				v('div', {
					classes: [
						css.root,
						css.collapsed,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'root',
					dir: null,
					lang: null
				}, [
					w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
					v('div', {
						classes: [
							css.toolbar,
							fixedCss.toolbarFixed
						]
					}, [
						null,
						slidePaneVDom,
						buttonVDom
					]),
					v('div', {
						classes: [
							css.content,
							fixedCss.contentFixed
						]
					}, [])
				]));

			h.trigger(`.${css.menuButton}`, 'onclick');
			h.trigger('@slide-pane-menu', 'onRequestClose');
			h.expect(() =>
				v('div', {
					classes: [
						css.root,
						css.collapsed,
						null,
						fixedCss.rootFixed,
						null,
						fixedCss.onTopFixed
					],
					key: 'root',
					dir: null,
					lang: null
				}, [
					w(GlobalEvent, { window: { resize: noop }, key: 'global' }),
					v('div', {
						classes: [
							css.toolbar,
							fixedCss.toolbarFixed
						]
					}, [
						null,
						slidePaneVDom,
						buttonVDom
					]),
					v('div', {
						classes: [
							css.content,
							fixedCss.contentFixed
						]
					}, [])
				]));
		}
	}
});
