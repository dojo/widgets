import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty } from '@dojo/test-extras/support/d';
import { v } from '@dojo/widget-core/d';
import TitlePane, { TitlePaneProperties } from '../../TitlePane';
import * as css from '../../styles/titlePane.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';
import { Keys } from '../../../common/util';

const isNonEmptyString = compareProperty((value: any) => {
	return typeof value === 'string' && value.length > 0;
});

interface TestEventInit extends EventInit {
	keyCode: number;
}

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
			classes: titlePane.classes(css.root, css.open, css.rootFixed)
		}, [
			v('div', {
				'aria-level': null,
				classes: titlePane.classes(css.title, css.titleFixed, css.closeable, css.closeableFixed),
				onclick: titlePane.listener,
				onkeyup: titlePane.listener,
				role: 'heading'
			}, [
				v('div', {
					'aria-controls': isNonEmptyString,
					'aria-disabled': null,
					'aria-expanded': 'true',
					classes: titlePane.classes(css.titleButton),
					id: <any> isNonEmptyString,
					role: 'button',
					tabIndex: 0
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
				onclick: titlePane.listener,
				onkeyup: titlePane.listener,
				role: 'heading'
			}, [
				v('div', {
					'aria-controls': isNonEmptyString,
					'aria-disabled': 'true',
					'aria-expanded': 'false',
					classes: titlePane.classes(css.titleButton),
					id: <any> isNonEmptyString,
					role: 'button',
					tabIndex: -1
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
			selector: `.${css.title}`
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
			selector: `.${css.title}`
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
			selector: `.${css.title}`
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
			selector: `.${css.title}`
		});

		assert.strictEqual(called, 1, 'onRequestClose should only becalled once');
	},

	'can not open pane on keyup'() {
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
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Enter },
			selector: `.${css.title}`
		});

		titlePane.setProperties({
			open: true,
			onRequestClose() {
				called++;
			},
			title: 'test'
		});
		titlePane.getRender();
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Enter },
			selector: `.${css.title}`
		});

		assert.strictEqual(called, 1, 'onRequestClose should only becalled once');
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
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Enter },
			selector: `.${css.title}`
		});
		assert.strictEqual(openCount, 1, 'onRequestOpen should be called on title enter keyup');

		titlePane.setProperties(props);
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Space },
			selector: `.${css.title}`
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
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Enter },
			selector: `.${css.title}`
		});
		assert.strictEqual(closeCount, 1, 'onRequestClose should be called on title enter keyup');

		titlePane.setProperties(props);
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Space },
			selector: `.${css.title}`
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
				titlePane.sendEvent<TestEventInit>('keyup', {
					eventInit: { keyCode: i },
					selector: `.${css.title}`
				});
				assert.isFalse(called, `keyCode {i} should be ignored`);
			}
		}
	}
});
