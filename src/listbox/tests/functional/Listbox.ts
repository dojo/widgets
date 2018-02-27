const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import { Remote } from 'intern/lib/executors/Node';
import keys from '@theintern/leadfoot/keys';
import * as css from '../../../theme/listbox.m.css';

const DELAY = 300;
const ERROR_MARGIN = 5;

function getPage(remote: Remote) {
	return remote
		.get('http://localhost:9000/_build/common/example/?module=listbox')
		.setFindTimeout(5000);
}

registerSuite('Listbox', {
	'clicking option selects it'() {
		const { mouseEnabled } = this.remote.session.capabilities;
		if (!mouseEnabled) {
			this.skip('Test requires mouse interactions.');
		}

		let selectedId = '';
		return getPage(this.remote)
			.findByCssSelector(`.${css.root} > div:nth-child(2) > div`)
				.getAttribute('id')
				.then((id: string) => {
					selectedId = id;
				})
				.click()
				.sleep(DELAY)
				.getAttribute('class')
				.then((className: string) => {
					assert.include(className, css.activeOption, 'clicked option has activeOption class');
					assert.include(className, css.selectedOption, 'clicked option has selectedOption class');
				})
				.end()
			.findByCssSelector(`.${css.root}`)
				.getAttribute('aria-activedescendant')
				.then((id: string) => {
					assert.strictEqual(id, selectedId, 'listbox aria-activedescendant is equal to clicked option id');
				});
	},

	'the selected option should be visible'() {
		const { touchEnabled } = this.remote.session.capabilities;
		let menuBottom: number;
		let menuTop: number;
		let itemHeight: number;

		if (touchEnabled) {
			this.skip('Arrow keys required for tests.');
		}

		return getPage(this.remote)
			.findByCssSelector(`.${css.root} > div:first-child > div`)
				.click()
				.end()
			.sleep(DELAY)
			.pressKeys(keys.ARROW_UP)
			.sleep(DELAY)
			.findByCssSelector(`.${css.root}`)
				.getPosition()
				.then(({ y }: { y: number; }) => {
					menuTop = y;
				})
				.getSize()
				.then(({ height }: { height: number }) => {
					menuBottom = menuTop + height;
				})
				.end()
			.findByCssSelector(`.${css.activeOption}`)
				.getSize()
				.then(({ height }: { height: number }) => {
					itemHeight = height;
				})
				.getPosition()
				.then(({ y }: { y: number; }) => {
					assert.isAtLeast(y, menuTop - ERROR_MARGIN);
					assert.isAtMost(Math.floor(y), Math.ceil(menuBottom - itemHeight) + ERROR_MARGIN, 'scrolled down');
				})
				.end()
			.pressKeys(keys.ARROW_DOWN)
			.sleep(DELAY)
			.findByCssSelector(`.${css.root}`)
				.getPosition()
				.then(({ y }: { y: number; }) => {
					menuTop = y;
				})
				.end()
			.findByCssSelector(`.${css.activeOption}`)
				.getPosition()
				.then(({ y }: { y: number; }) => {
					assert.isAtLeast(y, menuTop - ERROR_MARGIN, 'scroll back up');
				});
	},

	'keys move and select active option'() {
		const { browserName, touchEnabled } = this.remote.session.capabilities;
		if (touchEnabled || browserName === 'safari') {
			// safari driver doesn't recognize focus on divs
			this.skip('Arrow keys required for tests.');
		}

		return getPage(this.remote)
			.findByCssSelector(`.${css.root} > div:nth-child(2) > div`)
				.click()
				.sleep(DELAY)
				.end()
			.findByCssSelector(`.${css.root}`)
				.type(keys.ARROW_DOWN)
				.type(keys.ENTER)
				.sleep(DELAY)
				.end()
			.findByCssSelector(`.${css.root} > div:nth-child(3) > div`)
				.getAttribute('class')
				.then((className: string) => {
					assert.include(className, css.activeOption, 'down arrow moves active option');
					assert.include(className, css.selectedOption, 'enter selects option');
				});
	},

	'listbox is in tab order'() {
		const { browserName } = this.remote.session.capabilities;
		if (browserName === 'safari') {
			// TODO: https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/5403
			this.skip('SafariDriver does not move focus with tab key.');
		}

		return getPage(this.remote)
			.findByCssSelector(`.${css.root}`)
				.click()
				.sleep(DELAY)
				.type(keys.TAB)
				.sleep(DELAY)
				.end()
			.getActiveElement()
				.getAttribute('id')
				.then((id: string) => {
					assert.strictEqual(id, 'listbox2');
				});
	}
});
