import * as registerSuite from 'intern!object';
import harness, { Harness } from '@dojo/test-extras/harness';
import Tab, { TabProperties } from '../../Tab';
import { v } from '@dojo/widget-core/d';
import * as css from '../../styles/tabPane.m.css';

let tab: Harness<TabProperties, typeof Tab>;
registerSuite({
	name: 'Tab unit tests',
	beforeEach() {
		tab = harness(Tab);
	},
	afterEach() {
		tab.destroy();
	},

	'default render'() {
		tab.setChildren([ 'abc' ]);
		const expected = v('div', {
			'aria-labelledby': undefined,
			classes: tab.classes(css.tab),
			id: undefined,
			role: 'tabpanel'
		}, [
			'abc'
		]);
		tab.expectRender(expected);
	},

	'render with properties'() {
		tab.setProperties({
			id: 'testId1',
			labelledBy: 'testId2',
			key: 'key1'
		});
		tab.setChildren([ 'abc' ]);
		const expected = v('div', {
			'aria-labelledby': 'testId2',
			classes: tab.classes(css.tab),
			id: 'testId1',
			role: 'tabpanel'
		}, [
			'abc'
		]);
		tab.expectRender(expected);
	}
});
