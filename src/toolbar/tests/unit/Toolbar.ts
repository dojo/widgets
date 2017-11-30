const { registerSuite } = intern.getInterface('object');
import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import { v, w } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Toolbar from '../../Toolbar';
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
					css.rootFixed
				],
				key: 'root'
			}, [ null, null, null ]));
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
					css.rootFixed
				],
				key: 'root'
			}, [ null, null, null ]));
		},

		'fixed rendering'() {
			toolbar.setProperties({ fixed: true });
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.sticky,
					css.stickyFixed
				],
				key: 'root'
			}, [
				null,
				null,
				null
			]));
		},

		'custom title rendering'() {
			toolbar.setProperties({ title: 'test' });
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed
				],
				key: 'root'
			}, [
				v('div', {
					classes: [ css.title, css.titleFixed ]
				}, [ 'test' ]),
				null,
				null
			]));
		},

		'actions rendering'() {
			toolbar.setChildren([ 'test' ]);
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed
				],
				key: 'root'
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
			]));
		},

		'open and close menu'() {
			const slidePaneVDom = w(SlidePane, {
				align: Align.right,
				closeText: 'close menu',
				key: 'menu',
				onRequestClose: toolbar.listener,
				open: false,
				theme: undefined,
				title: 'Menu'
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
				'open menu',
				v('i', {
					classes: [ iconCss.icon, iconCss.barsIcon ],
					role: 'presentation',
					'aria-hidden': 'true'
				})
			]);


			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed
				],
				key: 'root'
			}, [ null, null, null ]));

			toolbar.setChildren([ 'test' ]);
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.collapsed
				],
				key: 'root'
			}, [
				null,
				slidePaneVDom,
				buttonVDom
			]));

			toolbar.sendEvent('click', { selector: `.${css.menuButton}` });
			toolbar.getRender();

			toolbar.callListener('onRequestClose', { key: 'menu' });
			toolbar.expectRender(v('div', {
				classes: [
					css.root,
					css.rootFixed,
					css.collapsed
				],
				key: 'root'
			}, [
				null,
				slidePaneVDom,
				buttonVDom
			]));
		}
	}
});
