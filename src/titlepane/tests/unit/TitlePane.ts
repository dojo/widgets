const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import TitlePane, { TitlePaneProperties } from '../../TitlePane';
import * as css from '../../../theme/titlepane/titlePane.m.css';
import * as fixedCss from '../../styles/titlePane.m.css';
import * as iconCss from '../../../theme/common/icons.m.css';
import { WNode } from '@dojo/widget-core/interfaces';

const compareId = { selector: '*', property: 'id', comparator: (property: any) => typeof property === 'string' && property.length > 0 };
const compareAriaLabelledby = { selector: '*', property: 'aria-labelledby', comparator: (property: any) => typeof property === 'string' && property.length > 0 };
const compareArialControls = { selector: '*', property: 'aria-controls', comparator: (property: any) => typeof property === 'string' && property.length > 0 };
const noop: any = () => {};
const createHarnessWithCompare = (renderFunction: () => WNode) => {
	return harness(renderFunction, [ compareId, compareAriaLabelledby, compareArialControls ]);
};

interface TestEventInit extends EventInit {
	keyCode: number;
}

registerSuite('TitlePane', {

	tests: {
		'default rendering'() {
			const h = createHarnessWithCompare(() => w(TitlePane, { title: 'test' }));

			h.expect(() => v('div', {
				classes: [ css.root, css.open, fixedCss.rootFixed ]
			}, [
				v('div', {
					'aria-level': null,
					classes: [ css.title, css.closeable, fixedCss.titleFixed, fixedCss.closeableFixed ],
					role: 'heading'
				}, [
					v('button', {
						'aria-controls': '',
						'aria-expanded': 'true',
						classes: css.titleButton,
						disabled: false,
						id: '',
						onclick: noop
					}, [
						v('i', {
							classes: [
								css.arrow,
								iconCss.icon,
								iconCss.downIcon
							],
							role: 'presentation',
							'aria-hidden': 'true'
						}),
						'test'
					])
				]),
				v('div', {
					'aria-hidden': null,
					'aria-labelledby': '',
					classes: css.content,
					id: '',
					key: 'content'
				}, [ ])
			]));
		},

		'Should construct with the passed properties'() {
			const h = createHarnessWithCompare(() => w(TitlePane, {
				closeable: false,
				headingLevel: 5,
				open: false,
				title: 'test'
			}));

			h.expect(() => v('div', {
				classes: [ css.root, null, fixedCss.rootFixed ]
			}, [
				v('div', {
					'aria-level': '5',
					classes: [ css.title, null, fixedCss.titleFixed, null ],
					role: 'heading'
				}, [
					v('button', {
						'aria-controls': '',
						'aria-expanded': 'false',
						classes: css.titleButton,
						disabled: true,
						id: '',
						onclick: noop
					}, [
						v('i', {
							classes: [
								css.arrow,
								iconCss.icon,
								iconCss.rightIcon
							],
							role: 'presentation',
							'aria-hidden': 'true'
						}),
						'test'
					])
				]),
				v('div', {
					'aria-hidden': 'true',
					'aria-labelledby': '',
					classes: css.content,
					id: '',
					key: 'content'
				}, [])
			]));
		},

		'click title to close'() {
			let called = false;
			const h = createHarnessWithCompare(() => w(TitlePane, {
				closeable: true,
				onRequestClose() {
					called = true;
				},
				title: 'test'
			}));

			h.trigger(`.${css.titleButton}`, 'onclick');
			assert.isTrue(called, 'onRequestClose should be called on title click');
		},

		'click title to open'() {
			let called = false;
			const h = createHarnessWithCompare(() => w(TitlePane, {
				closeable: true,
				open: false,
				onRequestOpen() {
					called = true;
				},
				title: 'test'
			}));
			h.trigger(`.${css.titleButton}`, 'onclick');
			assert.isTrue(called, 'onRequestOpen should be called on title click');
		},

		'can not open pane on click'() {
			let called = 0;
			let properties: TitlePaneProperties = {
				closeable: false,
				open: true,
				onRequestClose() {
					called++;
				},
				title: 'test'
			};
			const h = createHarnessWithCompare(() => w(TitlePane, properties));
			h.trigger(`.${css.titleButton}`, 'onclick');

			properties = {
				open: true,
				onRequestClose() {
					called++;
				},
				title: 'test'
			};
			h.trigger(`.${css.titleButton}`, 'onclick');
			assert.strictEqual(called, 1, 'onRequestClose should only becalled once');
		}
	}
});
