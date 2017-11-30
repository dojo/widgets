const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');
import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty } from '@dojo/test-extras/support/d';
import { v } from '@dojo/widget-core/d';

import Toolbar from '../../Toolbar';
import * as css from '../../styles/toolbar.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

const isNonEmptyString = compareProperty((value: any) => {
	return typeof value === 'string' && value.length > 0;
});

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
			}, [
				null,
				null,
				null
			]));
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
		}
	}
});
