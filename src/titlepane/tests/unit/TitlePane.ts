const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty } from '@dojo/test-extras/support/d';
import { v } from '@dojo/widget-core/d';
import TitlePane from '../../TitlePane';
import * as css from '../../styles/titlePane.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

const isNonEmptyString = compareProperty((value: any) => {
	return typeof value === 'string' && value.length > 0;
});

let titlePane: Harness<TitlePane>;
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

			titlePane.expectRender(
				v(
					'div',
					{
						classes: [css.root, css.open, css.rootFixed]
					},
					[
						v(
							'div',
							{
								'aria-level': null,
								classes: [css.title, css.closeable, css.titleFixed, css.closeableFixed],
								role: 'heading'
							},
							[
								v(
									'button',
									{
										'aria-controls': isNonEmptyString,
										'aria-expanded': 'true',
										classes: css.titleButton,
										disabled: false,
										id: <any>isNonEmptyString,
										onclick: titlePane.listener
									},
									[
										v('i', {
											classes: [css.arrow, iconCss.icon, iconCss.downIcon],
											role: 'presentation',
											'aria-hidden': 'true'
										}),
										'test'
									]
								)
							]
						),
						v(
							'div',
							{
								'aria-hidden': null,
								'aria-labelledby': isNonEmptyString,
								classes: css.content,
								id: <any>isNonEmptyString,
								key: 'content'
							},
							[]
						)
					]
				)
			);
		},

		'Should construct with the passed properties'() {
			titlePane.setProperties({
				closeable: false,
				headingLevel: 5,
				open: false,
				title: 'test'
			});

			titlePane.expectRender(
				v(
					'div',
					{
						classes: [css.root, null, css.rootFixed]
					},
					[
						v(
							'div',
							{
								'aria-level': '5',
								classes: [css.title, null, css.titleFixed, null],
								role: 'heading'
							},
							[
								v(
									'button',
									{
										'aria-controls': isNonEmptyString,
										'aria-expanded': 'false',
										classes: css.titleButton,
										disabled: true,
										id: <any>isNonEmptyString,
										onclick: titlePane.listener
									},
									[
										v('i', {
											classes: [css.arrow, iconCss.icon, iconCss.rightIcon],
											role: 'presentation',
											'aria-hidden': 'true'
										}),
										'test'
									]
								)
							]
						),
						v(
							'div',
							{
								'aria-hidden': 'true',
								'aria-labelledby': isNonEmptyString,
								classes: css.content,
								id: <any>isNonEmptyString,
								key: 'content'
							},
							[]
						)
					]
				)
			);
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
