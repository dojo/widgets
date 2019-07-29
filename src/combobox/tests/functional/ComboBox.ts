const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import keys from '@theintern/leadfoot/keys';
import { services } from '@theintern/a11y';
import * as listboxCss from '../../../theme/listbox.m.css';
import * as css from '../../../theme/combobox.m.css';
import { uuid } from '@dojo/framework/core/util';

const axe = services.axe;
const DELAY = 300;

function getPage(remote: Remote) {
	return remote
		.get(`http://localhost:9000/dist/dev/src/common/example/?id=${uuid()}#combobox`)
		.setFindTimeout(5000);
}

registerSuite('ComboBox', {
	'the results menu should be visible'() {
		return getPage(this.remote)
			.findByCssSelector(`.${css.trigger}`)
			.click()
			.end()
			.sleep(DELAY)
			.findByCssSelector(`.${css.dropdown}`)
			.getSize()
			.then(({ height }) => {
				assert.isAbove(height, 0);
			});
	},

	'the selected result menu should be visible'() {
		const { browserName, touchEnabled } = this.remote.session.capabilities;

		if (touchEnabled || browserName === 'firefox' || browserName === 'safari') {
			// TODO: FirefoxDriver and SafariDriver update the input value with non-printable characters.
			// https://openradar.appspot.com/radar?id=6097023048613888
			this.skip('Arrow keys required for tests.');
		}

		let menuBottom: number;
		let menuTop: number;
		let itemHeight: number;

		return getPage(this.remote)
			.findByCssSelector(`.${css.trigger}`)
			.click()
			.end()
			.sleep(DELAY)
			.findByCssSelector(`.${css.controls} input`)
			.type(keys.ARROW_UP)
			.end()
			.sleep(DELAY)
			.findByCssSelector(`.${css.dropdown}`)
			.getPosition()
			.then(({ y }: { y: number }) => {
				menuTop = y;
			})
			.getSize()
			.then(({ height }: { height: number }) => {
				menuBottom = menuTop + height;
			})
			.end()
			.findByCssSelector(`.${listboxCss.activeOption}`)
			.getSize()
			.then(({ height }: { height: number }) => {
				itemHeight = height;
			})
			.getPosition()
			.then(({ y }: { y: number }) => {
				assert.isAtLeast(y, menuTop);
				assert.isAtMost(Math.floor(y), Math.ceil((menuBottom - itemHeight) * 1.05));
			});
	},

	'tab order'() {
		const { browserName } = this.remote.session.capabilities;

		if (browserName === 'safari') {
			// TODO: https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/5403
			this.skip('SafariDriver does not move focus with tab key.');
		}

		if (browserName === 'firefox') {
			this.skip('FirefoxDriver sends actual charcodes to the input.');
		}

		const initialTab =
			browserName === 'chrome'
				? () => this.remote.findByTagName('body').type(keys.TAB)
				: () => this.remote.pressKeys(keys.TAB);

		return getPage(this.remote)
			.findByCssSelector(`input[type=text]`)
			.click()
			.sleep(DELAY)
			.then(initialTab)
			.getActiveElement()
			.getTagName()
			.then((tag: string) => {
				assert.strictEqual(
					tag.toLowerCase(),
					'input',
					'Only the input should be in the tab order'
				);
			});
	},

	'the input should receive focus when the "clear" button is activated'() {
		if (this.remote.session.capabilities.browserName === 'safari') {
			// TODO: https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/5403
			this.skip('SafariDriver does not move focus with tab key.');
		}

		return getPage(this.remote)
			.findByCssSelector(`.${css.clear}`)
			.click()
			.sleep(DELAY)
			.getActiveElement()
			.getTagName()
			.then((tag) => {
				assert.strictEqual(
					tag.toLowerCase(),
					'input',
					'The input should receive focus when the "clear" button is clicked.'
				);
			})
			.type(keys.TAB)
			.getActiveElement()
			.type(keys.ENTER)
			.sleep(DELAY)
			.getActiveElement()
			.getTagName()
			.then((tag) => {
				assert.strictEqual(
					tag.toLowerCase(),
					'input',
					'The input should receive focus when the "clear" button is activated with the ENTER key.'
				);
			});
	},

	'the input should receive focus when the "open" button is activated'() {
		if (this.remote.session.capabilities.browserName === 'safari') {
			// TODO: https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/5403
			this.skip('SafariDriver does not move focus with tab key.');
		}

		return getPage(this.remote)
			.findByCssSelector(`.${css.trigger}`)
			.click()
			.sleep(DELAY)
			.getActiveElement()
			.getTagName()
			.then((tag) => {
				assert.strictEqual(
					tag.toLowerCase(),
					'input',
					'The input should receive focus when the "open" button is clicked.'
				);
			});
	},

	'check accessibility'() {
		return getPage(this.remote).then(axe.createChecker());
	}
});
