import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import harness, { Harness } from '@dojo/test-extras/harness';
import { compareProperty } from '@dojo/test-extras/support/d';
import { v } from '@dojo/widget-core/d';
import TitlePane, { TitlePaneProperties } from '../../TitlePane';
import * as css from '../../styles/titlePane.m.css';
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
			classes: titlePane.classes(css.root, css.rootFixed)
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
					id: <any> isNonEmptyString,
					role: 'button',
					tabIndex: 0
				}, [ 'test' ])
			]),
			v('div', {
				'aria-hidden': null,
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
					id: <any> isNonEmptyString,
					role: 'button',
					tabIndex: -1
				}, [ 'test' ])
			]),
			v('div', {
				'aria-hidden': 'true',
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
		const onRequestClose = sinon.spy();

		titlePane.setProperties({
			closeable: true,
			onRequestClose,
			title: 'test'
		});

		titlePane.sendEvent('click', {
			selector: `.${css.title}`
		});
		assert.isTrue(onRequestClose.called, 'onRequestClose should be called on title click');
	},

	'click title to open'() {
		const onRequestOpen = sinon.spy();
		titlePane.setProperties({
			closeable: true,
			open: false,
			onRequestOpen,
			title: 'test'
		});

		titlePane.sendEvent('click', {
			selector: `.${css.title}`
		});
		assert.isTrue(onRequestOpen.called, 'onRequestOpen should be called on title click');
	},

	'can not open pane on click'() {
		const onRequestClose = sinon.spy();
		titlePane.setProperties({
			closeable: false,
			open: true,
			onRequestClose,
			title: 'test'
		});
		titlePane.getRender();
		titlePane.sendEvent('click', {
			selector: `.${css.title}`
		});

		titlePane.setProperties({
			open: true,
			onRequestClose,
			title: 'test'
		});
		titlePane.getRender();
		titlePane.sendEvent('click', {
			selector: `.${css.title}`
		});

		assert.isTrue(onRequestClose.calledOnce, 'onRequestClose should only becalled once');
	},

	'can not open pane on keyup'() {
		const onRequestClose = sinon.spy();
		titlePane.setProperties({
			closeable: false,
			open: true,
			onRequestClose,
			title: 'test'
		});
		titlePane.getRender();
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Enter },
			selector: `.${css.title}`
		});

		titlePane.setProperties({
			open: true,
			onRequestClose,
			title: 'test'
		});
		titlePane.getRender();
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Enter },
			selector: `.${css.title}`
		});

		assert.isTrue(onRequestClose.calledOnce, 'onRequestClose should only becalled once');
	},

	'open on keyup'() {
		const onRequestOpen = sinon.spy();
		const props = {
			closeable: true,
			open: false,
			onRequestOpen,
			title: 'test'
		};

		titlePane.setProperties(props);
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Enter },
			selector: `.${css.title}`
		});
		assert.isTrue(onRequestOpen.calledOnce, 'onRequestOpen should be called on title enter keyup');

		titlePane.setProperties(props);
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Space },
			selector: `.${css.title}`
		});
		assert.isTrue(onRequestOpen.calledTwice, 'onRequestOpen should be called on title space keyup');
	},

	'close on keyup'() {
		const onRequestClose = sinon.spy();
		const props = {
			closeable: true,
			open: true,
			onRequestClose,
			title: 'test'
		};

		titlePane.setProperties(props);
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Enter },
			selector: `.${css.title}`
		});
		assert.isTrue(onRequestClose.calledOnce, 'onRequestClose should be called on title enter keyup');

		titlePane.setProperties(props);
		titlePane.sendEvent<TestEventInit>('keyup', {
			eventInit: { keyCode: Keys.Space },
			selector: `.${css.title}`
		});
		assert.isTrue(onRequestClose.calledTwice, 'onRequestClose should be called on title space keyup');
	},

	'keyup: only respond to enter and space'() {
		const onRequestClose = sinon.spy();
		const onRequestOpen = sinon.spy();
		titlePane.setProperties({
			closeable: true,
			open: false,
			onRequestClose,
			onRequestOpen,
			title: 'test'
		});

		for (let i = 8; i < 223; i++) {
			if (i !== Keys.Enter && i !== Keys.Space) {
				titlePane.sendEvent<TestEventInit>('keyup', {
					eventInit: { keyCode: i },
					selector: `.${css.title}`
				});
				assert.isFalse(onRequestClose.called, `keyCode {i} should be ignored`);
				assert.isFalse(onRequestOpen.called, `keyCode {i} should be ignored`);
			}
		}
	}
});
