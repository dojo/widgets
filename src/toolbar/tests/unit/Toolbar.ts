const { registerSuite } = intern.getInterface('object');
import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import { v, w } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Toolbar, { Position } from '../../Toolbar';
import SlidePane, { Align } from '../../../slidepane/SlidePane';
import * as css from '../../styles/toolbar.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

let toolbar: Harness<Toolbar>;
registerSuite('Toolbar', {

	beforeEach() {
		toolbar = harness(Toolbar);
	},

	afterEach() {
		toolbar.destroy();
	},

	tests: {
		'default rendering'() {
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.onTopFixed
				],
				key: 'root',
				dir: null,
				lang: null
			}, [
				v('div', {
					classes: [
						css.toolbar,
						css.toolbarFixed
					]
				}, [ null, null, null]),
				v('div', {
					classes: [
						css.content,
						css.contentFixed
					]
				}, [])
			]));
		},

		'bottom-positioned rendering'() {
			toolbar.setProperties({ position: Position.bottom });
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.onBottomFixed
				],
				key: 'root',
				dir: null,
				lang: null
			}, [
				v('div', {
					classes: [
						css.toolbar,
						css.toolbarFixed
					]
				}, [ null, null, null]),
				v('div', {
					classes: [
						css.content,
						css.contentFixed
					]
				}, [])
			]));
		},

		'expanded rendering'() {
			toolbar.setProperties({ collapseWidth: 10 });
			toolbar.mockMeta(Dimensions, {
				get(key: string | number) {
					return {
						offset: { height: 100, left: 100, top: 100, width: 100 },
						position: { bottom: 200, left: 100, right: 200, top: 100 },
						scroll: { height: 100, left: 100, top: 100, width: 100 },
						size: { width: 100, height: 100 }
					};
				}
			});
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.onTopFixed
				],
				key: 'root',
				dir: null,
				lang: null
			}, [
				v('div', {
					classes: [
						css.toolbar,
						css.toolbarFixed
					]
				}, [ null, null, null]),
				v('div', {
					classes: [
						css.content,
						css.contentFixed
					]
				}, [])
			]));
		},

		'fixed rendering'() {
			toolbar.setProperties({ fixed: true });
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.onTopFixed,
					css.sticky,
					css.stickyFixed
				],
				key: 'root',
				dir: null,
				lang: null
			}, [
				v('div', {
					classes: [
						css.toolbar,
						css.toolbarFixed
					]
				}, [ null, null, null]),
				v('div', {
					classes: [
						css.content,
						css.contentFixed
					]
				}, [])
			]));
		},

		'custom title rendering'() {
			toolbar.setProperties({ title: 'test' });
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.onTopFixed
				],
				key: 'root',
				dir: null,
				lang: null
			}, [
				v('div', {
					classes: [
						css.toolbar,
						css.toolbarFixed
					]
				}, [
					v('div', {
						classes: [ css.title, css.titleFixed ]
					}, [ 'test' ]),
					null,
					null
				]),
				v('div', {
					classes: [
						css.content,
						css.contentFixed
					]
				}, [])
			]));
		},

		'actions rendering'() {
			toolbar.setProperties({ actions: [ 'test' ] });
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.onTopFixed
				],
				key: 'root',
				dir: null,
				lang: null
			}, [
				v('div', {
					classes: [
						css.toolbar,
						css.toolbarFixed
					]
				}, [
					null,
					v('div', {
						classes: [ css.actions, css.actionsFixed ],
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
						css.contentFixed
					]
				}, [])
			]));
		},

		'open and close menu'() {
			toolbar.setProperties({ collapseWidth: 1000 });
			toolbar.mockMeta(Dimensions, {
				get(key: string | number) {
					return {
						offset: { height: 100, left: 100, top: 100, width: 100 },
						position: { bottom: 200, left: 100, right: 200, top: 100 },
						scroll: { height: 100, left: 100, top: 100, width: 100 },
						size: { width: 100, height: 100 }
					};
				}
			});

			const slidePaneVDom = w(SlidePane, {
				align: Align.right,
				closeText: 'close foo',
				key: 'slide-pane-menu',
				onRequestClose: toolbar.listener,
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
				classes: [ css.menuButton, css.menuButtonFixed ],
				onclick: toolbar.listener
			}, [
				'open foo',
				v('i', {
					classes: [ iconCss.icon, iconCss.barsIcon ],
					role: 'presentation',
					'aria-hidden': 'true'
				})
			]);

			toolbar.setProperties({ onCollapse: () => {} });

			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.onTopFixed
				],
				key: 'root',
				dir: null,
				lang: null
			}, [
				v('div', {
					classes: [
						css.toolbar,
						css.toolbarFixed
					]
				}, [ null, null, null]),
				v('div', {
					classes: [
						css.content,
						css.contentFixed
					]
				}, [])
			]));

			toolbar.setProperties({ actions: [ 'test' ], menuTitle: 'foo' });
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.collapsed,
					css.onTopFixed
				],
				key: 'root',
				dir: null,
				lang: null
			}, [
				v('div', {
					classes: [
						css.toolbar,
						css.toolbarFixed
					]
				}, [
					null,
					slidePaneVDom,
					buttonVDom
				]),
				v('div', {
					classes: [
						css.content,
						css.contentFixed
					]
				}, [])
			]));

			toolbar.sendEvent('click', { selector: `.${css.menuButton}` });
			toolbar.getRender();

			toolbar.callListener('onRequestClose', { key: 'slide-pane-menu' });
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.collapsed,
					css.onTopFixed
				],
				key: 'root',
				dir: null,
				lang: null
			}, [
				v('div', {
					classes: [
						css.toolbar,
						css.toolbarFixed
					]
				}, [
					null,
					slidePaneVDom,
					buttonVDom
				]),
				v('div', {
					classes: [
						css.content,
						css.contentFixed
					]
				}, [])
			]));
		}
	}
});
