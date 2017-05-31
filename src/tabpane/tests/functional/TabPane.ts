import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as css from '../../styles/tabPane.m.css';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=tabpane')
		.setFindTimeout(5000);
}

registerSuite({
	name: 'TabPane',

	'tab pane should be visible'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
			.getSize()
			.then(({ height, width }: { height: number; width: number; }) => {
				assert.isAbove(height, 0, 'The tab pane should be greater than zero.');
				assert.isAbove(width, 0, 'The tab pane should be greater than zero.');
			})
			.end();
	},
	'tabs should be changable'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
				.findByCssSelector(`.${css.tabButton}:last-child`)
				.getProperty('className')
				.then((className: string) => {
				assert.notInclude(className, css.activeTabButton, 'The last tab should not be selected initially.');
			})
				.click()
				.then(function (this: any) {
					this.getProperty('className')
						.then((className: string) => {
							assert.include(className, css.activeTabButton, 'The last tab should be selected after being clicked.');
						});
				})
				.end()
			.end();
	},

	'tab content should be changed when tab is changed'(this: any) {
		let tabContent: string;
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
				.findByCssSelector(`.${css.tab}`)
				.getVisibleText()
				.then((text: string) => {
					tabContent = text;
				})
				.end()

				.findByCssSelector(`.${css.tabButton}:last-child`)
				.click()
				.end()

				.findByCssSelector(`.${css.tab}`)
				.getVisibleText()
				.then((text: string) => {
					assert.notStrictEqual(text, tabContent);
				})
				.end()

			.end();
	},
	'disabled tab should not be selectable'(this: any) {
		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
				.findByCssSelector(`.${css.disabledTabButton}`)
				.getProperty('className')
				.then((className: string) => {
					assert.notInclude(className, css.activeTabButton, 'Disabled tab should not be selected.');
				})
				.click()
				.then(function (this: any) {
					this.getProperty('className')
						.then((className: string) => {
							assert.notInclude(className, css.activeTabButton, 'Disabled tab should be selected after being clicked.');
						});
				})
				.end()
			.end();
	},
	'tabs should be closeable'(this: any) {
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
			.getProperty('childElementCount')
			.then((count: number) => {
				assert.strictEqual(count, childElementCount - 1);
			})
			.end();
	}
});
