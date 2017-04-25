import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as keys from 'leadfoot/keys';

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=combobox')
		.setFindTimeout(5000);
}

registerSuite({
	name: 'ComboBox',

	'the controls should be visible'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('[role=combobox]:nth-of-type(2) input')
				.isDisplayed()
				.then((displayed: boolean) => {
					assert.isTrue(displayed, 'The input should be displayed.');
				})
				.getSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					assert.isAbove(height, 0, 'The input height should be greater than zero.');
					assert.isAbove(width, 0, 'The input width should be greater than zero.');
				})
				.end()
			.findByCssSelector('[role=combobox]:nth-of-type(2) button')
				.isDisplayed()
				.then((displayed: boolean) => {
					assert.isTrue(displayed, 'The "clear" button should be displayed.');
				})
				.getSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					assert.isAbove(height, 0, 'The "clear" button height should be greater than zero.');
					assert.isAbove(width, 0, 'The "clear" button width should be greater than zero.');
				})
				.end()
			.findByCssSelector('[role=combobox]:nth-of-type(2) button:nth-of-type(2)')
				.isDisplayed()
				.then((displayed: boolean) => {
					assert.isTrue(displayed, 'The "open" button should be displayed.');
				})
				.getSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					assert.isAbove(height, 0, 'The "open" button height should be greater than zero.');
					assert.isAbove(width, 0, 'The "open" button width should be greater than zero.');
				});
	},

	'the results menu should be visible'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('[role=combobox] input')
				.click()
				.end()
			.findByCssSelector('[role=listbox]')
				.isDisplayed()
				.then((displayed: boolean) => {
					assert.isTrue(displayed, 'The menu should be visible.');
				});
	},

	'the selected result menu should be visible'(this: any) {
		let menuBottom: number;
		let menuTop: number;
		let itemHeight: number;

		return getPage(this.remote)
			.findByCssSelector('[role=combobox] input')
				.click()
				.pressKeys(keys.ARROW_UP)
				.end()
			.findByCssSelector('[role=listbox]')
				.getPosition()
				.then(({ y }: { y: number; }) => {
					menuTop = y;
				})
				.getSize()
				.then(({ height }: { height: number }) => {
					menuBottom = menuTop + height;
				})
				.end()
			.findByCssSelector('[role=listbox] [data-selected=true]')
				.getSize()
				.then(({ height }: { height: number }) => {
					itemHeight = height;
				})
				.getPosition()
				.then(({ y }: { y: number; }) => {
					assert.isAtLeast(y, menuTop);
					assert.isAtMost(y, menuBottom - itemHeight);
				});
	},

	'tab order'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('[role=combobox]:nth-of-type(2) input')
				.click()
				.pressKeys([ keys.ARROW_DOWN, keys.TAB ])
			.getActiveElement()
				.getProperty('textContent')
				.then((text: string) => {
					assert.strictEqual(text, 'clear combo box', 'The "clear" button should receive focus.');
				})
				.pressKeys(keys.TAB)
			.getActiveElement()
				.getProperty('textContent')
				.then((text: string) => {
					assert.strictEqual(text, 'open combo box', 'The "open" button should receive focus.');
				})
				.pressKeys(keys.TAB)
			.getActiveElement()
				.getTagName()
				.then((tag: string) => {
					assert.strictEqual(tag.toLowerCase(), 'input', 'The results menu should not receive focus.');
				});
	},

	'the input should receive focus when the "clear" button is activated'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('[role=combobox]:nth-of-type(2) input')
				.click()
				.pressKeys(keys.TAB)
			.getActiveElement()
				.click()
				.sleep(30)
			.getActiveElement()
				.getTagName()
				.then((tag: string) => {
					assert.strictEqual(tag.toLowerCase(), 'input', 'The input should receive focus when the "clear" button is clicked.');
				})
				.pressKeys(keys.TAB)
			.getActiveElement()
				.pressKeys(keys.ENTER)
				.sleep(30)
			.getActiveElement()
				.getTagName()
				.then((tag: string) => {
					assert.strictEqual(tag.toLowerCase(), 'input', 'The input should receive focus when the "clear" button is activated with the ENTER key.');
				});
	},

	'the input should receive focus when the "open" button is activated'(this: any) {
		return getPage(this.remote)
			.findByCssSelector('[role=combobox] input')
				.click()
				.pressKeys(keys.TAB)
			.getActiveElement()
				.click()
				.sleep(30)
			.getActiveElement()
				.getTagName()
				.then((tag: string) => {
					assert.strictEqual(tag.toLowerCase(), 'input', 'The input should receive focus when the "open" button is clicked.');
				})
				.pressKeys(keys.TAB)
			.getActiveElement()
				.pressKeys(keys.ENTER)
				.sleep(30)
			.getActiveElement()
				.getTagName()
				.then((tag: string) => {
					assert.strictEqual(tag.toLowerCase(), 'input', 'The input should receive focus when the "open" button is activated with the ENTER key.');
				});
	}
});
