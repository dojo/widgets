import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as keys from 'leadfoot/keys';
import * as css from '../../styles/comboBox.m.css';

const DELAY = 300;

function getPage(remote: any) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=combobox')
		.setFindTimeout(5000);
}

registerSuite({
	name: 'ComboBox',

	'the controls should be over the right end of the input'(this: any) {
		let clearButtonSize: { height: number; width: number; };
		let closeButtonSize: { height: number; width: number; };
		let inputPosition: { x: number; y: number };
		let inputSize: { height: number; width: number; };

		return getPage(this.remote)
			.findByCssSelector(`.${css.input}`)
				.getSize()
					.then(({ height, width }: { height: number; width: number; }) => {
						inputSize = { height, width };
					})
				.getPosition()
					.then((position: { x: number; y: number; }) => {
						inputPosition = position;
					})
				.end()
			.findByCssSelector(`.${css.arrow}`)
				.getSize()
					.then(({ height, width }: { height: number; width: number; }) => {
						closeButtonSize = { height, width };
					})
				.getPosition()
					.then(({ x, y }: { x: number; y: number; }) => {
						const expectedX = inputPosition.x + inputSize.width - closeButtonSize.width;

						assert.closeTo(x, expectedX, 10, 'The close button should be near the right edge of the input.');
						assert.isAbove(y, inputPosition.y);
						assert.isBelow(y + closeButtonSize.height, inputPosition.y + inputSize.height);
					})
				.end()
			.findByCssSelector(`.${css.clear}`)
				.getSize()
					.then(({ height, width }: { height: number; width: number; }) => {
						clearButtonSize = { height, width };
					})
				.getPosition()
					.then(({ x, y }: { x: number; y: number; }) => {
						const expectedX = inputPosition.x + inputSize.width -
							closeButtonSize.width - clearButtonSize.width;

						assert.closeTo(x, expectedX, 20, 'The clear button should be near the left edge of the close button.');
						assert.isAbove(y, inputPosition.y);
						assert.isBelow(y + clearButtonSize.height, inputPosition.y + inputSize.height);
					});
	},

	'the results menu should be visible'(this: any) {
		let inputWidth: number;

		return getPage(this.remote)
			.findByCssSelector(`.${css.input}`)
				.getSize()
					.then(({ width }: { width: number; }) => {
						inputWidth = width;
					})
				.end()
			.findByCssSelector(`.${css.arrow}`)
				.click()
				.end()
			.sleep(DELAY)
			.findByCssSelector(`.${css.results}`)
				.getSize()
				.then(({ height, width }: { height: number; width: number; }) => {
					assert.strictEqual(width, inputWidth);
					assert.isAbove(height, 0);
				});
	},

	'the selected result menu should be visible'(this: any) {
		if (this.remote.session.capabilities.browserName === 'firefox') {
			this.skip('FirefoxDriver sends actual charcodes to the input.');
		}

		let menuBottom: number;
		let menuTop: number;
		let itemHeight: number;

		return getPage(this.remote)
			.findByCssSelector(`.${css.arrow}`)
				.click()
				.end()
			.findByCssSelector(`.${css.input}`)
				.pressKeys(keys.ARROW_UP)
				.end()
			.findByCssSelector(`.${css.results}`)
				.getPosition()
				.then(({ y }: { y: number; }) => {
					menuTop = y;
				})
				.getSize()
				.then(({ height }: { height: number }) => {
					menuBottom = menuTop + height;
				})
				.end()
			.findByCssSelector(`.${css.selectedResult}`)
				.getSize()
				.then(({ height }: { height: number }) => {
					itemHeight = height;
				})
				.getPosition()
				.then(({ y }: { y: number; }) => {
					assert.isAtLeast(y, menuTop);
					assert.isAtMost(Math.floor(y), Math.ceil(menuBottom - itemHeight));
				});
	},

	'tab order'(this: any) {
		const { browserName } = this.remote.session.capabilities;

		if (browserName === 'safari') {
			// TODO: https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/5403
			this.skip('SafariDriver does not move focus with tab key.');
		}

		if (browserName === 'firefox') {
			this.skip('FirefoxDriver sends actual charcodes to the input.');
		}

		return getPage(this.remote)
			.findByCssSelector(`.${css.arrow}`)
				.click()
				.sleep(DELAY)
				.pressKeys(keys.TAB)
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
		if (this.remote.session.capabilities.browserName === 'safari') {
			// TODO: https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/5403
			this.skip('SafariDriver does not move focus with tab key.');
		}

		return getPage(this.remote)
			.findByCssSelector(`.${css.clear}`)
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
		if (this.remote.session.capabilities.browserName === 'safari') {
			// TODO: https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/5403
			this.skip('SafariDriver does not move focus with tab key.');
		}

		return getPage(this.remote)
			.findByCssSelector(`.${css.arrow}`)
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
