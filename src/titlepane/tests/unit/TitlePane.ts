const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty } from '@dojo/test-extras/support/d';
import { v } from '@dojo/widget-core/d';
import TitlePane, { TitlePaneProperties } from '../../TitlePane';
import * as css from '../../styles/titlePane.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

const isNonEmptyString = compareProperty((value: any) => {
	return typeof value === 'string' && value.length > 0;
});

interface TestEventInit extends EventInit {
	keyCode: number;
}

let titlePane: Harness<TitlePaneProperties, typeof TitlePane>;
registerSuite('TitlePane', {

	beforeEach() {
		titlePane = harness(TitlePane);
	},

	afterEach() {
		titlePane.destroy();
	},

	tests: {
		'default rendering'() {
			titlePane.setProperties({
				title: 'test'
			});

			titlePane.expectRender(v('div', {
				classes: titlePane.classes(css.root, css.open, css.rootFixed)
			}, [
				v('div', {
					'aria-level': null,
					classes: titlePane.classes(css.title, css.titleFixed, css.closeable, css.closeableFixed),
					role: 'heading'
				}, [
					v('button', {
						'aria-controls': isNonEmptyString,
						'aria-expanded': 'true',
						classes: titlePane.classes(css.titleButton),
						disabled: false,
						id: <any> isNonEmptyString,
						onclick: titlePane.listener
					}, [
						v('i', {
							classes: titlePane.classes(
								css.arrow,
								iconCss.icon,
								iconCss.downIcon
							),
							role: 'presentation',
							'aria-hidden': 'true'
						}),
						'test'
					])
				]),
				v('div', {
					'aria-hidden': null,
					'aria-labelledby': isNonEmptyString,
					classes: titlePane.classes(css.content),
					id: <any> isNonEmptyString,
					key: 'content'
				})
			]));
		},

		'Should construct with the passed properties'() {
			titlePane.setProperties({
				closeable: false,
				headingLevel: 5,
				open: false,
				title: 'test'
			});

			titlePane.expectRender(v('div', {
				classes: titlePane.classes(css.root, css.rootFixed)
			}, [
				v('div', {
					'aria-level': '5',
					classes: titlePane.classes(css.title, css.titleFixed),
					role: 'heading'
				}, [
					v('button', {
						'aria-controls': isNonEmptyString,
						'aria-expanded': 'false',
						classes: titlePane.classes(css.titleButton),
						disabled: true,
						id: <any> isNonEmptyString,
						onclick: titlePane.listener
					}, [
						v('i', {
							classes: titlePane.classes(
								css.arrow,
								iconCss.icon,
								iconCss.rightIcon
							),
							role: 'presentation',
							'aria-hidden': 'true'
						}),
						'test'
					])
				]),
				v('div', {
					'aria-hidden': 'true',
					'aria-labelledby': isNonEmptyString,
					classes: titlePane.classes(css.content),
					id: <any> isNonEmptyString,
					key: 'content'
				})
			]));
		},

		'click title to close'() {
			let called = false;
			titlePane.setProperties({
				closeable: true,
				onRequestClose() {
					called = true;
				},
				title: 'test'
			});

			titlePane.sendEvent('click', {
				selector: `.${css.titleButton}`
			});
			assert.isTrue(called, 'onRequestClose should be called on title click');
		},

		'click title to open'() {
			let called = false;
			titlePane.setProperties({
				closeable: true,
				open: false,
				onRequestOpen() {
					called = true;
				},
				title: 'test'
			});

			titlePane.sendEvent('click', {
				selector: `.${css.titleButton}`
			});
			assert.isTrue(called, 'onRequestOpen should be called on title click');
		},

		'can not open pane on click'() {
			let called = 0;
			titlePane.setProperties({
				closeable: false,
				open: true,
				onRequestClose() {
					called++;
				},
				title: 'test'
			});
			titlePane.getRender();
			titlePane.sendEvent('click', {
				selector: `.${css.titleButton}`
			});

			titlePane.setProperties({
				open: true,
				onRequestClose() {
					called++;
				},
				title: 'test'
			});
			titlePane.getRender();
			titlePane.sendEvent('click', {
				selector: `.${css.titleButton}`
			});

			assert.strictEqual(called, 1, 'onRequestClose should only becalled once');
		}
	}
});
