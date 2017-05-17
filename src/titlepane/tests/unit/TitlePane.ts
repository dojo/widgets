import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty } from '@dojo/test-extras/support/d';
import { v } from '@dojo/widget-core/d';
import TitlePane, { TitlePaneProperties } from '../../TitlePane';
import * as css from '../../styles/titlePane.m.css';
import { Keys } from '../../../common/util';

const isNonEmptyString = compareProperty((value: any) => {
	return typeof value === 'string' && value.length > 0;
});

let titlePane: Harness<TitlePaneProperties, typeof TitlePane>;
registerSuite({
	name: 'TitlePane',

	beforeEach() {
		titlePane = harness(TitlePane);
	},

	afterEach() {
		titlePane.destroy();
	},

	'default rendering'() {
		titlePane.setProperties({
			title: 'test'
		});

		titlePane.expectRender(v('div', {
			classes: titlePane.classes(css.root)
		}, [
			v('div', {
				'aria-level': '',
				classes: titlePane.classes(css.title, css.closeable),
				onclick: titlePane.listener,
				onkeyup: titlePane.listener,
				role: 'heading'
			}, [
				v('div', {
					'aria-controls': isNonEmptyString,
					'aria-disabled': 'false',
					'aria-expanded': 'true',
					id: <any> isNonEmptyString,
					role: 'button',
					tabIndex: 0
				}, [ 'test' ])
			]),
			v('div', {
				'aria-labelledby': isNonEmptyString,
				afterCreate: titlePane.listener,
				afterUpdate: titlePane.listener,
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
			classes: titlePane.classes(css.root)
		}, [
			v('div', {
				'aria-level': '5',
				classes: titlePane.classes(css.title),
				onclick: undefined,
				onkeyup: undefined,
				role: 'heading'
			}, [
				v('div', {
					'aria-controls': isNonEmptyString,
					'aria-disabled': 'true',
					'aria-expanded': 'false',
					id: <any> isNonEmptyString,
					role: 'button',
					tabIndex: -1
				}, [ 'test' ])
			]),
			v('div', {
				'aria-labelledby': isNonEmptyString,
				afterCreate: titlePane.listener,
				afterUpdate: titlePane.listener,
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
			selector: '[role="heading"]'
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
			selector: '[role="heading"]'
		});
		assert.isTrue(called, 'onRequestOpen should be called on title click');
	},

	'open on keyup'() {
		let openCount = 0;
		const props = {
			closeable: true,
			open: false,
			onRequestOpen() {
				openCount++;
			},
			title: 'test'
		};

		titlePane.setProperties(props);
		titlePane.sendEvent('keyup', {
			eventInit: { keyCode: Keys.Enter },
			selector: '[role="heading"]'
		});
		assert.strictEqual(openCount, 1, 'onRequestOpen should be called on title enter keyup');

		titlePane.setProperties(props);
		titlePane.sendEvent('keyup', {
			eventInit: { keyCode: Keys.Space },
			selector: '[role="heading"]'
		});
		assert.strictEqual(openCount, 2, 'onRequestOpen should be called on title space keyup');
	},

	'close on keyup'() {
		let closeCount = 0;
		const props = {
			closeable: true,
			open: true,
			onRequestClose() {
				closeCount++;
			},
			title: 'test'
		};

		titlePane.setProperties(props);
		titlePane.sendEvent('keyup', {
			eventInit: { keyCode: Keys.Enter },
			selector: '[role="heading"]'
		});
		assert.strictEqual(closeCount, 1, 'onRequestClose should be called on title enter keyup');

		titlePane.setProperties(props);
		titlePane.sendEvent('keyup', {
			eventInit: { keyCode: Keys.Space },
			selector: '[role="heading"]'
		});
		assert.strictEqual(closeCount, 2, 'onRequestClose should be called on title space keyup');
	},

	'keyup: only respond to enter and space'() {
		let called = false;
		titlePane.setProperties({
			closeable: true,
			open: false,
			onRequestClose() {
				called = true;
			},
			onRequestOpen() {
				called = true;
			},
			title: 'test'
		});

		for (let i = 8; i < 223; i++) {
			if (i !== Keys.Enter && i !== Keys.Space) {
				titlePane.sendEvent('keyup', {
					eventInit: { keyCode: i },
					selector: '[role="heading"]'
				});
				assert.isFalse(called, `keyCode {i} should be ignored`);
			}
		}
	}
});
