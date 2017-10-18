const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import * as css from '../../styles/tabController.m.css';

function getPage(remote: Remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=tabcontroller')
		.setFindTimeout(5000);
}

registerSuite('TabController', {

	'tab pane should be visible'() {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
			.getSize()
			.then(({ height, width }) => {
				assert.isAbove(height, 0, 'The tab pane should be greater than zero.');
				assert.isAbove(width, 0, 'The tab pane should be greater than zero.');
			})
			.end();
	},
	'tabs should be changable'() {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
				.findByCssSelector(`.${css.tabButton}:last-child`)
					.getProperty('className')
					.then((className: string) => {
						assert.notInclude(className, css.activeTabButton, 'The last tab should not be selected initially.');
					})
					.click()
				.end()
				.findByCssSelector(`.${css.tabButton}:last-child`)
					.getProperty('className')
					.then((className: string) => {
						assert.include(className, css.activeTabButton, 'The last tab should be selected after being clicked.');
					})
				.end()
			.end();
	},

	'tab content should be changed when tab is changed'() {
		let tabContent: string;
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
				.findByCssSelector(`.${css.tab}`)
					.getVisibleText()
					.then(text => {
						tabContent = text;
					})
				.end()

				.findByCssSelector(`.${css.tabButton}:last-child`)
					.click()
				.end()

				.sleep(300)

				.findByCssSelector(`.${css.tab}`)
					.getVisibleText()
					.then(text => {
						assert.notStrictEqual(text, tabContent);
					})
				.end()
			.end();
	},
	'disabled tab should not be selectable'() {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
				.findByCssSelector(`.${css.disabledTabButton}`)
					.getProperty('className')
					.then((className: string) => {
						assert.notInclude(className, css.activeTabButton, 'Disabled tab should not be selected.');
					})
					.click()
				.end()
				.findByCssSelector(`.${css.disabledTabButton}`)
					.getProperty('className')
					.then((className: string) => {
						assert.notInclude(className, css.activeTabButton, 'Disabled tab should be selected after being clicked.');
					})
				.end()
			.end();
	},
	'tabs should be closeable'() {
		let childElementCount: number;
		return getPage(this.remote)
			.findByCssSelector(`.${css.tabButtons}`)
				.getProperty('childElementCount')
				.then((count: number) => {
					childElementCount = count;
				})
				.findByCssSelector(`.${css.close}`)
					.click()
				.end()
			.end()
			.sleep(300)
			.findByCssSelector(`.${css.tabButtons}`)
				.getProperty('childElementCount')
				.then((count: number) => {
					assert.strictEqual(count, childElementCount - 1);
				})
			.end();
	}
});
